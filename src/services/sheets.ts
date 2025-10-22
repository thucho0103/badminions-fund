// sheets.ts
export type RawValues = string[][];
export interface CellStyle {
  backgroundColor?: string; // CSS color
  color?: string;            // CSS color
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface TextRun {
  startIndex: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface StyledCell {
  value: string;
  style: CellStyle;
  runs: TextRun[]; // rich text segments (nếu cần hiển thị từng đoạn)
}

export type StyledGrid = StyledCell[][];

const API = "https://sheets.googleapis.com/v4/spreadsheets";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;
const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID as string;

/**
 * Giữ nguyên hàm cũ: nhanh, nhưng KHÔNG có màu/format.
 */
export async function fetchValues(range: string): Promise<RawValues> {
  const url = `${API}/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return (data.values ?? []) as RawValues;
}

/**
 * HÀM MỚI: Lấy đầy đủ giá trị + màu sắc/format của ô (effectiveFormat).
 * YÊU CẦU sheet public (read-only) khi dùng API key.
 */
export async function fetchStyledGrid(range: string): Promise<StyledGrid> {
  const FIELDS =
    "sheets(data(rowData(values(" +
    "formattedValue," +
    "textFormatRuns(format/foregroundColor,format/foregroundColorStyle,format/bold,format/italic,format/underline)," +
    "effectiveFormat(backgroundColor,backgroundColorStyle,textFormat/foregroundColor,textFormat/foregroundColorStyle,textFormat/bold,textFormat/italic,textFormat/underline)" +
    "))))";

  const url =
    `${API}/${sheetId}` +
    `?includeGridData=true` +
    `&ranges=${encodeURIComponent(range)}` +
    `&fields=${encodeURIComponent(FIELDS)}` +
    `&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API error ${res.status}: ${text}`);
  }
  const data = await res.json();

  // Helper: chọn rgbColor đúng (ưu tiên ...ColorStyle.rgbColor nếu có theme)
  const pickRgb = (obj?: any) => obj?.rgbColor ?? obj ?? undefined;

  // Convert {red,green,blue,alpha} 0..1 -> CSS string
  const rgbaToCss = (c?: { red?: number; green?: number; blue?: number; alpha?: number } | null) => {
    if (!c) return undefined;
    const r = Math.round((c.red ?? 0) * 255);
    const g = Math.round((c.green ?? 0) * 255);
    const b = Math.round((c.blue ?? 0) * 255);
    const a = c.alpha ?? 1;
    return a < 1
      ? `rgba(${r},${g},${b},${a})`
      : `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
  };

  const rowData = data?.sheets?.[0]?.data?.[0]?.rowData ?? [];
  const rows: StyledGrid = rowData.map((row: any) => {
    const cells = row?.values ?? [];
    return cells.map((cell: any): StyledCell => {
      const val = cell?.formattedValue ?? "";

      const eff = cell?.effectiveFormat;
      const tf = eff?.textFormat;

      const bg =
        pickRgb(eff?.backgroundColorStyle) ??
        pickRgb(eff?.backgroundColor);
      const fg =
        pickRgb(tf?.foregroundColorStyle) ??
        pickRgb(tf?.foregroundColor);

      const runs: TextRun[] = (cell?.textFormatRuns ?? []).map((r: any) => ({
        startIndex: r?.startIndex ?? 0,
        color: rgbaToCss(pickRgb(r?.format?.foregroundColorStyle) ?? pickRgb(r?.format?.foregroundColor)),
        bold: !!r?.format?.bold,
        italic: !!r?.format?.italic,
        underline: !!r?.format?.underline,
      }));

      return {
        value: val,
        style: {
          backgroundColor: rgbaToCss(bg),
          color: rgbaToCss(fg),
          bold: !!tf?.bold,
          italic: !!tf?.italic,
          underline: !!tf?.underline,
        },
        runs,
      };
    });
  });

  return rows;
}
