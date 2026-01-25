export type TransactionType = 'send' | 'receive' | 'swap' | 'purchase';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  token: string;
  usdValue: number;
  address: string;
  timestamp: Date;
  description?: string;
}

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    status: 'completed',
    amount: 500,
    token: 'LARE',
    usdValue: 620,
    address: '0x1a2b...3c4d',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    description: 'Payment received',
  },
  {
    id: '2',
    type: 'send',
    status: 'completed',
    amount: 0.15,
    token: 'ETH',
    usdValue: 486.83,
    address: '0x5e6f...7g8h',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: 'Transfer to external wallet',
  },
  {
    id: '3',
    type: 'purchase',
    status: 'completed',
    amount: 100,
    token: 'USDC',
    usdValue: 100,
    address: 'Card ****4521',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: 'Bought with card',
  },
  {
    id: '4',
    type: 'swap',
    status: 'completed',
    amount: 250,
    token: 'LARE',
    usdValue: 310,
    address: '→ 0.095 ETH',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    description: 'Swapped LARE for ETH',
  },
  {
    id: '5',
    type: 'receive',
    status: 'pending',
    amount: 1000,
    token: 'LARE',
    usdValue: 1240,
    address: '0x9i0j...1k2l',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    description: 'Incoming payment',
  },
];
