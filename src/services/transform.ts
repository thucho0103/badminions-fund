import type { FundRecord } from "../models/fund";
import type { Member } from "../models/member";

/**
 * Hàm tiện ích: Chuyển chuỗi số tiền có thể chứa dấu chấm hoặc phẩy thành number
 *  - "400.000" -> 400000
 *  - "400,000" -> 400000
 *  - "" hoặc undefined -> 0
 */
const toNumber = (s?: string): number =>
  s && s.trim() !== ""
    ? Number(String(s).replace(/[.,\s]/g, ""))
    : 0;

/**
 * Map dữ liệu Google Sheet (sổ quỹ)
 * Cột: Tháng | Ngày | Diễn giải | Thu | Chi | Note
 */
export function rowsToFunds(rows: string[][]): FundRecord[] {
  return rows
    .filter((r) => r.some((c) => c && c.trim() !== "")) // bỏ dòng trống
    .map((r, idx) => ({
      id: `f-${idx}-${r[0] ?? ""}-${r[1] ?? ""}`,
      month: Number(r[0] ?? 0),
      date: r[1] ?? "",
      description: r[2] ?? "",
      income: toNumber(r[3]),
      expense: toNumber(r[4]),
      note: r[5] ?? "",
    }));
}

/**
 * Map dữ liệu Google Sheet (thành viên)
 * Cột: STT | Tên Thành viên | Cố định T11 | Cố định T12
 */
export function rowsToMembers(rows: string[][]): Member[] {
  return rows
    .filter((r) => r.some((c) => c && c.trim() !== "")) // bỏ dòng trống
    .map((r) => ({
      id: Number(r[0] ?? 0),
      name: r[1] ?? "",
      fixedT11: toNumber(r[2]),
      fixedT12: toNumber(r[3]),
    }))
    .sort((a, b) => a.id - b.id);
}
