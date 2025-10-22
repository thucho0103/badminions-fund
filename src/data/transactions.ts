import type { Transaction } from '../types'

export const transactions: Transaction[] = [
  {
    date: '2025-02-28',
    description: 'Thu quỹ tháng 2 từ thành viên cố định',
    type: 'Thu',
    amount: 4_600_000,
  },
  {
    date: '2025-03-02',
    description: 'Thu phí vãng lai (03/03)',
    type: 'Thu',
    amount: 180_000,
  },
  {
    date: '2025-03-03',
    description: 'Thanh toán tiền sân tuần 1',
    type: 'Chi',
    amount: 1_200_000,
  },
  {
    date: '2025-03-04',
    description: 'Mua ống cầu RSL',
    type: 'Chi',
    amount: 720_000,
  },
]
