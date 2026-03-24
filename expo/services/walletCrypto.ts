const WORD_LIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
  'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
  'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
  'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
  'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
  'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
  'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
  'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
  'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
  'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
  'avoid', 'awake', 'aware', 'awesome', 'awful', 'awkward', 'axis', 'baby',
  'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo',
  'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic',
  'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef',
  'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench',
  'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid',
  'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade',
  'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom',
  'blow', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil',
  'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow',
  'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand',
  'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright',
  'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown',
  'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk',
  'bullet', 'bundle', 'bunny', 'burden', 'burger', 'burst', 'bus', 'business',
  'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus',
];

export interface WalletKeys {
  mnemonic: string;
  publicKey: string;
  privateKey: string;
  solanaAddress: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  change24h: number;
  icon: string;
  chain: string;
}

export interface TransactionRecord {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake';
  status: 'pending' | 'confirmed' | 'failed';
  amount: number;
  token: string;
  usdValue: number;
  from: string;
  to: string;
  hash: string;
  timestamp: Date;
  fee: number;
  chain: string;
}

function pseudoRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateMnemonic(wordCount: 12 | 24 = 12): string {
  const words: string[] = [];
  const rand = pseudoRandom(Date.now());
  for (let i = 0; i < wordCount; i++) {
    const idx = Math.floor(rand() * WORD_LIST.length);
    words.push(WORD_LIST[idx]);
  }
  console.log('[WalletCrypto] Generated mnemonic with', wordCount, 'words');
  return words.join(' ');
}

export function validateMnemonic(mnemonic: string): boolean {
  const words = mnemonic.trim().split(/\s+/);
  if (words.length !== 12 && words.length !== 24) return false;
  return words.every(w => WORD_LIST.includes(w.toLowerCase()));
}

export function deriveKeysFromMnemonic(mnemonic: string): WalletKeys {
  const chars = '0123456789abcdef';
  const rand = pseudoRandom(
    mnemonic.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  );
  const genHex = (len: number) => {
    let hex = '';
    for (let i = 0; i < len; i++) {
      hex += chars[Math.floor(rand() * chars.length)];
    }
    return hex;
  };

  const publicKey = '0x' + genHex(40);
  const privateKey = '0x' + genHex(64);
  const solBytes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let solAddr = '';
  for (let i = 0; i < 44; i++) {
    solAddr += solBytes[Math.floor(rand() * solBytes.length)];
  }

  console.log('[WalletCrypto] Derived keys, public:', publicKey.slice(0, 10) + '...');
  return { mnemonic, publicKey, privateKey, solanaAddress: solAddr };
}

export async function getBalances(_publicKey: string): Promise<TokenBalance[]> {
  await new Promise(r => setTimeout(r, 800));
  return [
    { symbol: 'SOL', name: 'Solana', balance: 24.5832, usdValue: 148.22, change24h: 3.42, icon: '◎', chain: 'solana' },
    { symbol: 'LARE', name: 'Larecoin', balance: 12450.75, usdValue: 0.847, change24h: 5.12, icon: '🔷', chain: 'solana' },
    { symbol: 'LUSD', name: 'Lare USD', balance: 5280.50, usdValue: 1.00, change24h: 0.01, icon: '💵', chain: 'solana' },
    { symbol: 'ETH', name: 'Ethereum', balance: 1.2045, usdValue: 3245.80, change24h: -1.23, icon: 'Ξ', chain: 'ethereum' },
    { symbol: 'USDC', name: 'USD Coin', balance: 2150.00, usdValue: 1.00, change24h: 0.00, icon: '🪙', chain: 'solana' },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.0234, usdValue: 67450.00, change24h: 2.15, icon: '₿', chain: 'bitcoin' },
  ];
}

export async function sendTransaction(params: {
  fromPrivateKey: string;
  toAddress: string;
  amount: number;
  token: string;
  chain: string;
}): Promise<TransactionRecord> {
  console.log('[WalletCrypto] Sending', params.amount, params.token, 'to', params.toAddress.slice(0, 8) + '...');
  await new Promise(r => setTimeout(r, 2000));
  const rand = pseudoRandom(Date.now());
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(rand() * chars.length)];

  return {
    id: Date.now().toString(),
    type: 'send',
    status: 'confirmed',
    amount: params.amount,
    token: params.token,
    usdValue: params.amount * 1.0,
    from: 'self',
    to: params.toAddress,
    hash,
    timestamp: new Date(),
    fee: 0.000005,
    chain: params.chain,
  };
}

export async function getTransactionHistory(_publicKey: string): Promise<TransactionRecord[]> {
  await new Promise(r => setTimeout(r, 600));
  const now = Date.now();
  return [
    { id: '1', type: 'receive', status: 'confirmed', amount: 500, token: 'LARE', usdValue: 423.5, from: '0xabc...def', to: 'self', hash: '0x1a2b...', timestamp: new Date(now - 3600000), fee: 0.000005, chain: 'solana' },
    { id: '2', type: 'send', status: 'confirmed', amount: 0.5, token: 'SOL', usdValue: 74.11, from: 'self', to: '0x789...012', hash: '0x3c4d...', timestamp: new Date(now - 7200000), fee: 0.000005, chain: 'solana' },
    { id: '3', type: 'swap', status: 'confirmed', amount: 100, token: 'USDC', usdValue: 100, from: 'USDC', to: 'LARE', hash: '0x5e6f...', timestamp: new Date(now - 86400000), fee: 0.001, chain: 'solana' },
    { id: '4', type: 'receive', status: 'confirmed', amount: 0.01, token: 'ETH', usdValue: 32.46, from: '0xdef...123', to: 'self', hash: '0x7g8h...', timestamp: new Date(now - 172800000), fee: 0.002, chain: 'ethereum' },
    { id: '5', type: 'stake', status: 'confirmed', amount: 1000, token: 'LARE', usdValue: 847, from: 'self', to: 'staking-pool', hash: '0x9i0j...', timestamp: new Date(now - 259200000), fee: 0.000005, chain: 'solana' },
  ];
}

export function formatAddress(address: string, chars: number = 6): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function solToLamports(sol: number): number {
  return Math.round(sol * 1_000_000_000);
}
