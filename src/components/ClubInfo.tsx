interface ClubInfoProps {
  formatCurrency: (value: number) => string
}

const qrCodeUrl = new URL('../assets/qr_code.png', import.meta.url).href;

const ClubInfo = ({ formatCurrency }: ClubInfoProps) => (
  <section className="info-grid">
    <div className="info-card qr-card">
      <img className="qr-image" src={qrCodeUrl} alt="QR code tham gia Badminions" />
    </div>

    <div className="info-card">
      <h3>Chi tiết CLB</h3>
      <ul>
        <li>
          <span className="label">Thời gian:</span>
          <span>17h15 - 19h15 (Thứ 3 / 5 / 7)</span>
        </li>
        <li>
          <span className="label">Địa điểm:</span>
          <span>Sân Hiếu Con - 172 Đỗ Quỳ</span>
        </li>
      </ul>
      <p></p>
      <h3>Biểu phí</h3>
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
