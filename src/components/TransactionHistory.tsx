import type { FundRecord } from "../models/fund"

interface TransactionHistoryProps {
  transactions: FundRecord[]
  formatCurrency: (value: number) => string
}

const TransactionHistory = ({ transactions, formatCurrency }: TransactionHistoryProps) => (
  <section className="history">
    <h2>Lịch sử thu chi</h2>
    <div className="table-wrapper">
      <table>
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
          {transactions.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.month}</td>
              <td>{entry.date}</td>
              <td>{entry.description}</td>
              <td>{formatCurrency(entry.income)}</td>
              <td>{formatCurrency(entry.expense)}</td>
              <td>{entry.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

export default TransactionHistory
