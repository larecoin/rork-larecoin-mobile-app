export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
  stockCount: number;
}

export interface Order {
  id: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  customerAddress: string;
  timestamp: Date;
  paymentToken: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich, bold single shot',
    price: 3.50,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200',
    category: 'Coffee',
    inStock: true,
    stockCount: 100,
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.50,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200',
    category: 'Coffee',
    inStock: true,
    stockCount: 85,
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Fresh butter croissant',
    price: 3.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200',
    category: 'Pastry',
    inStock: true,
    stockCount: 24,
  },
  {
    id: '4',
    name: 'Avocado Toast',
    description: 'Sourdough with fresh avocado',
    price: 9.50,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200',
    category: 'Food',
    inStock: true,
    stockCount: 15,
  },
  {
    id: '5',
    name: 'Latte',
    description: 'Smooth espresso with steamed milk',
    price: 5.00,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200',
    category: 'Coffee',
    inStock: true,
    stockCount: 50,
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { product: products[0], quantity: 2 },
      { product: products[2], quantity: 1 },
    ],
    total: 10.00,
    status: 'pending',
    customerAddress: '0x3d4e...5f6g',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    paymentToken: 'LARE',
  },
  {
    id: 'ORD-002',
    items: [
      { product: products[3], quantity: 1 },
      { product: products[1], quantity: 1 },
    ],
    total: 14.00,
    status: 'completed',
    customerAddress: '0x7h8i...9j0k',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    paymentToken: 'ETH',
  },
  {
    id: 'ORD-003',
    items: [
      { product: products[4], quantity: 3 },
    ],
    total: 15.00,
    status: 'completed',
    customerAddress: '0x1l2m...3n4o',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    paymentToken: 'USDC',
  },
];

export const merchantStats = {
  todayRevenue: 847.50,
  weekRevenue: 4235.80,
  monthRevenue: 18420.00,
  totalOrders: 156,
  pendingOrders: 3,
  topProduct: 'Cappuccino',
};
