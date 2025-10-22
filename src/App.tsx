import { useEffect, useState } from 'react'
import './App.css'
import AppFooter from './components/AppFooter'
import ClubInfo from './components/ClubInfo'
import HeroSection from './components/HeroSection'
import MembersTable from './components/MembersTable'
import SummarySection from './components/SummarySection'
import TransactionHistory from './components/TransactionHistory'
import type { FundRecord } from './models/fund'
import type { Member } from './models/member'
import { formatCurrency } from './utils/formatCurrency'
import { fetchValues } from './services/sheets'
import { rowsToFunds, rowsToMembers } from './services/transform'

function App() {
  
  const [funds, setFunds] = useState<string[][]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [fundRecords, setFundRecords] = useState<FundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [fundRows, memberRows, fundRecords] = await Promise.all([
          fetchValues("THE BADMINIONS!I2:I4"),
          fetchValues("THE BADMINIONS!J7:M100"),
          fetchValues("THE BADMINIONS!A7:F100"),
        ]);
        setFunds(fundRows);
        setFundRecords(rowsToFunds(fundRecords));
        setMembers(rowsToMembers(memberRows));  
      } catch (e: any) {
        setErr(e?.message ?? "Load data failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Đang tải dữ liệu…</div>;
  if (err) return <div className="p-6 text-red-600">Lỗi: {err}</div>;
  
  return (
    <div className="page">
      <HeroSection />
      <ClubInfo formatCurrency={formatCurrency} />
      <SummarySection totalIncome={funds[0].at(0) ?? ""} totalExpense={funds[1].at(0) ?? ""} finalTotal={funds[2].at(0) ?? ""}/>
      <MembersTable members={members} />
      <p className='mb-4'></p>
      <TransactionHistory transactions={fundRecords} formatCurrency={formatCurrency} />
      <AppFooter />
    </div>
  )
}

export default App
