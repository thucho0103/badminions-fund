import type { FundRecord } from "../models/fund";
import type { Member } from "../models/member";

/**
 * Helper to clean currency string and convert to number.
 * Handles: "300.000" -> 300000, "-50.000" -> -50000, etc.
 */
const toNumber = (s?: string): number => {
  if (!s || s.trim() === "") return 0;
  // Keep only digits and the minus sign
  const clean = String(s).replace(/[^0-9-]/g, "");
  const num = Number(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Determines if a period string (e.g. "Cố định T8") represents a future month.
 * Assumes the season starts in November (T11).
 */
const isFuturePeriod = (period: string, currentDate: Date = new Date()): boolean => {
  const match = period.match(/T(\d+)/i);
  if (!match) return false; // Keep columns that don't match the format
  
  const m = Number(match[1]);
  if (m < 1 || m > 12) return false;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-indexed (1 to 12)

  let periodYear = currentYear;
  if (currentMonth >= 11) {
    if (m >= 11) {
      periodYear = currentYear;
    } else {
      periodYear = currentYear + 1;
    }
  } else {
    if (m >= 11) {
      periodYear = currentYear - 1;
    } else {
      periodYear = currentYear;
    }
  }

  // Compare year and month
  if (periodYear > currentYear) return true;
  if (periodYear === currentYear && m > currentMonth) return true;
  
  return false;
};

/**
 * Transforms transaction rows to FundRecords.
 * Expected columns: Tháng | Ngày | Diễn giải | Thu | Chi | Note.
 * Propagates the month values downwards first, then reverses the list
 * to show the newest transactions (present/recent) at the top of the history list.
 */
export function rowsToFunds(rows: string[][]): FundRecord[] {
  if (rows.length === 0) return [];
  // Skip header if it is ["Tháng", "Ngày", "Diễn giải", "Thu", "Chi", "Note"]
  const startIdx = rows[0]?.[2]?.toLowerCase().includes("diễn giải") ? 1 : 0;
  
  let currentMonth = 0;
  
  return rows
    .slice(startIdx)
    .filter((r) => r.some((c) => c && c.trim() !== "")) // skip empty rows
    .map((r, idx) => {
      const match = String(r[0] ?? "").match(/\d+/);
      const monthVal = match ? Number(match[0]) : 0;
      if (monthVal > 0) {
        currentMonth = monthVal;
      }
      
      return {
        id: `f-${idx}-${r[0] ?? ""}-${r[1] ?? ""}`,
        month: currentMonth,
        date: r[1] ?? "",
        description: r[2] ?? "",
        income: toNumber(r[3]),
        expense: toNumber(r[4]),
        note: r[5] ?? "",
      };
    });
}

/**
 * Transforms member rows to Member models and extracts periods.
 * Expected columns: STT | Tên Thành viên | [Periods...]
 * Excludes future months based on the current system date.
 * Totals are calculated dynamically in the frontend based on active periods.
 */
export function rowsToMembers(rows: any[][]): { periods: string[]; members: Member[] } {
  if (rows.length === 0) return { periods: [], members: [] };
  
  const headers = rows[0];
  // Map periods to their original column index in 'headers' and filter out empty columns
  const allPeriods = headers.slice(2)
    .map((h: any, idx: number) => ({
      name: (typeof h === "object" ? h.value : h)?.trim() ?? "",
      originalIdx: 2 + idx
    }))
    .filter((p) => p.name !== "");
  
  // Filter out periods that are in the future
  const currentDate = new Date();
  const activePeriods = allPeriods.filter((p) => !isFuturePeriod(p.name, currentDate));
  const periods = activePeriods.map((p) => p.name);
  
  const members = rows
    .slice(1)
    .filter((r) => {
      const getVal = (cell: any) => typeof cell === "object" ? cell?.value : cell;
      const stt = getVal(r[0]);
      return r.length > 1 && stt && stt.trim() !== "" && stt.toLowerCase() !== "tổng";
    })
    .map((r) => {
      const getVal = (cell: any) => typeof cell === "object" ? cell?.value : cell;
      const id = Number(getVal(r[0])?.trim() ?? 0);
      const name = getVal(r[1])?.trim() ?? "";
      
      // Check if text color of the name cell is red (#ff0000)
      const color = typeof r[1] === "object" ? r[1]?.style?.color : undefined;
      const isInactive = color === "#ff0000";
      
      const payments: { [period: string]: number } = {};
      let total = 0;
      
      activePeriods.forEach((p) => {
        const val = toNumber(getVal(r[p.originalIdx]));
        payments[p.name] = val;
        total += val;
      });
      
      return {
        id,
        name,
        payments,
        total,
        isInactive,
      };
    })
    .filter((member) => !member.isInactive)
    .sort((a, b) => a.id - b.id);

  return { periods, members };
}
