import { useState, useMemo, useEffect } from "react"
import type { FundRecord } from "../models/fund"

interface TransactionHistoryProps {
  transactions: FundRecord[]
  formatCurrency: (value: number) => string
}

const TransactionHistory = ({ transactions, formatCurrency }: TransactionHistoryProps) => {
  // Find all unique months in transactions and order them descendingly (latest first)
  const uniqueMonths = useMemo(() => {
    const monthsArr: number[] = [];
    transactions.forEach(t => {
      if (t.month > 0 && !monthsArr.includes(t.month)) {
        monthsArr.push(t.month);
      }
    });
    return monthsArr.reverse();
  }, [transactions]);

  // Default to the current calendar month if available, else the latest month
  const defaultMonth = useMemo(() => {
    const currentCalendarMonth = new Date().getMonth() + 1; // 7 (July)
    if (uniqueMonths.includes(currentCalendarMonth)) {
      return currentCalendarMonth;
    }
    return uniqueMonths[0] ?? 0;
  }, [uniqueMonths]);

  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  // Sync selectedMonth with defaultMonth when transactions/uniqueMonths load
  useEffect(() => {
    if (uniqueMonths.length > 0) {
      if (selectedMonth === 0 || !uniqueMonths.includes(selectedMonth)) {
        setSelectedMonth(defaultMonth);
      }
    }
  }, [uniqueMonths, defaultMonth, selectedMonth]);

  const activeMonth = uniqueMonths.includes(selectedMonth) ? selectedMonth : defaultMonth;

  // Filter transactions for the selected month (keeps chronological order)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => t.month === activeMonth);
  }, [transactions, activeMonth]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when month changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeMonth]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const columnWidths = ["6%", "6%", "32%", "14%", "14%", "30%"];

  const getMonthLabel = (m: number) => {
    // Determine year based on month index (November 2025 starts the season)
    const year = m >= 10 ? 2025 : 2026;
    return `Tháng ${m}/${year}`;
  };

  return (
    <section className="history">
      <div className="history-header">
        <h2>Lịch sử thu chi</h2>
        <div className="month-picker-container">
          <label htmlFor="month-select" className="month-picker-label">Chọn tháng:</label>
          <select
            id="month-select"
            value={activeMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="month-picker-select"
          >
            {uniqueMonths.map(m => (
              <option key={m} value={m}>
                {getMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="history-table">
          <colgroup>
            {columnWidths.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Ngày</th>
              <th>Diễn giải</th>
              <th>Thu</th>
              <th>Chi</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.month > 0 ? entry.month : ""}</td>
                <td>{entry.date}</td>
                <td>{entry.description}</td>
                <td className="income">{entry.income > 0 ? formatCurrency(entry.income) : "-"}</td>
                <td className="expense">{entry.expense > 0 ? formatCurrency(entry.expense) : "-"}</td>
                <td>{entry.note}</td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  Không có dữ liệu giao dịch cho tháng này.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination-container">
            <span className="pagination-info">
              Hiển thị {Math.min(indexOfFirstItem + 1, totalItems)} - {Math.min(indexOfLastItem, totalItems)} trong tổng số {totalItems} giao dịch
            </span>
            <div className="pagination-buttons">
              <button 
                onClick={() => paginate(1)} 
                disabled={currentPage === 1}
                className="pagination-btn first-last"
                title="Trang đầu"
              >
                &laquo;
              </button>
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Trước
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`pagination-btn page-num ${currentPage === number ? "active" : ""}`}
                >
                  {number}
                </button>
              ))}
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Sau
              </button>
              <button 
                onClick={() => paginate(totalPages)} 
                disabled={currentPage === totalPages}
                className="pagination-btn first-last"
                title="Trang cuối"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TransactionHistory
