import { useState } from "react"
import type { Member } from "../models/member"
import { formatCurrency } from "../utils/formatCurrency"

interface MembersTableProps {
  periods: string[]
  members: Member[]
}

const MembersTable = ({ periods, members }: MembersTableProps) => {
  const [showAllPeriods, setShowAllPeriods] = useState(false);

  // Show only 3 most recent periods by default if there are more than 3
  const visiblePeriods = showAllPeriods || periods.length <= 3 
    ? periods 
    : periods.slice(-3);

  return (
    <section className="members">
      <div className="members-header">
        <h2>Danh sách thành viên</h2>
        {periods.length > 3 && (
          <button 
            className="toggle-periods-btn"
            onClick={() => setShowAllPeriods(!showAllPeriods)}
          >
            {showAllPeriods ? "⬅️ Thu gọn tháng cũ" : "📅 Xem các tháng cũ"}
          </button>
        )}
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Thành viên</th>
              {visiblePeriods.map((period) => (
                <th key={period}>{period}</th>
              ))}
              <th>Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                {visiblePeriods.map((period) => {
                  const paidVal = member.payments[period];
                  return (
                    <td key={period}>
                      {paidVal && paidVal > 0 ? formatCurrency(paidVal) : "-"}
                    </td>
                  );
                })}
                <td><strong>{formatCurrency(member.total)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MembersTable
