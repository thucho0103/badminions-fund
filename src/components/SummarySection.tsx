
interface SummarySectionProps {
  totalIncome: string,
  totalExpense: string,
  finalTotal: string,
}

const SummarySection = ({ totalIncome, totalExpense, finalTotal }: SummarySectionProps) => (
  <section className="summary">
    <h2>Tổng thu, chi</h2>
    <div className="summary-grid">
      <div className="summary-card">
        <span className="summary-label">Tổng thu</span>
        <strong className="income">{totalIncome}</strong>
      </div>
      <div className="summary-card">
        <span className="summary-label">Tổng chi</span>
        <strong className="expense">{totalExpense}</strong>
      </div>
      <div className="summary-card">
        <span className="summary-label">Số dư cuối</span>
        <strong className="income">
          {finalTotal}
        </strong>
      </div>
    </div>
  </section>
)

export default SummarySection
