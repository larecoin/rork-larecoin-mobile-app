export interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
  usdValue: number;
  change24h: number;
}

export const tokens: Token[] = [
  {
    id: 'lare',
    symbol: 'LARE',
    name: 'Larecoin',
    icon: '💰',
    color: '#D4AF37',
    balance: 12547.89,
    usdValue: 1.24,
    change24h: 5.67,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    color: '#627EEA',
    balance: 2.458,
    usdValue: 3245.50,
    change24h: -1.23,
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    color: '#2775CA',
    balance: 5420.00,
    usdValue: 1.00,
    change24h: 0.01,
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    color: '#9945FF',
    balance: 45.67,
    usdValue: 142.80,
    change24h: 3.45,
  },
];

export const calculateTotalBalance = (tokenList: Token[]): number => {
  return tokenList.reduce((total, token) => total + (token.balance * token.usdValue), 0);
};
