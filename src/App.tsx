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
import { fetchValues, fetchStyledGrid } from './services/sheets'
import { rowsToFunds, rowsToMembers } from './services/transform'

function App() {
  const [funds, setFunds] = useState<string[][]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [fundRecords, setFundRecords] = useState<FundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'transactions'>('members');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [fundRows, memberRows, fundRecordRows] = await Promise.all([
          fetchValues("THE BADMINIONS!I2:I4"),
          fetchStyledGrid("THE BADMINIONS!J114:Z145"),
          fetchValues("THE BADMINIONS!A7:F300"),
        ]);
        setFunds(fundRows);
        setFundRecords(rowsToFunds(fundRecordRows));
        
        const parsed = rowsToMembers(memberRows);
        setPeriods(parsed.periods);
        setMembers(parsed.members);
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
      <SummarySection 
        totalIncome={funds[0]?.at(0) ?? ""} 
        totalExpense={funds[1]?.at(0) ?? ""} 
        finalTotal={funds[2]?.at(0) ?? ""}
      />
      
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          👥 Danh sách thành viên
        </button>
        <button 
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          📊 Lịch sử thu chi
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'members' ? (
          <MembersTable periods={periods} members={members} />
        ) : (
          <TransactionHistory transactions={fundRecords} formatCurrency={formatCurrency} />
        )}
      </div>
      
      <AppFooter />
    </div>
  )
}

export default App
