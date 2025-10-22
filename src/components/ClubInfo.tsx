interface ClubInfoProps {
  formatCurrency: (value: number) => string
}

const ClubInfo = ({ formatCurrency }: ClubInfoProps) => (
  <section className="info-grid">
    <div className="info-card">
      <h2>Chi tiết CLB</h2>
      <ul>
        <li>
          <span className="label">Thời gian:</span>
          <span>17h15 - 19h15 (Thứ 3 / 5 / 7)</span>
        </li>
        <li>
          <span className="label">Địa điểm:</span>
          <span>Sân Hiếu Con - 172 Đỗ Quỳ</span>
        </li>
        <li>
          <span className="label">Liên hệ:</span>
          <span>badminton.badminions@gmail.com</span>
        </li>
      </ul>
    </div>

    <div className="info-card">
      <h2>Biểu phí</h2>
      <div className="fees">
        <div>
          <h3>Cố định</h3>
          <p>Nam: {formatCurrency(500_000)}/tháng</p>
          <p>Nữ: {formatCurrency(400_000)}/tháng</p>
        </div>
        <div>
          <h3>Vãng lai</h3>
          <p>Nam: {formatCurrency(50_000)}/buổi</p>
          <p>Nữ: {formatCurrency(40_000)}/buổi</p>
        </div>
      </div>
    </div>
  </section>
)

export default ClubInfo
