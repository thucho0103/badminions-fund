import type { Member } from "../models/member"
import { formatCurrency } from "../utils/formatCurrency"

interface MembersTableProps {
  members: Member[]
}

const MembersTable = ({ members }: MembersTableProps) => (
  <section className="members">
    <h2>Danh sách thành viên</h2>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Thành viên</th>
            <th>Cố định T11</th>
            <th>Cố định T12</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{formatCurrency(member.fixedT11)}</td>
              <td>{formatCurrency(member.fixedT12)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

export default MembersTable
