export interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  sn: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROSES' | 'SUKSES';
  createdAt: string;
  whatsappMessage: string;
}

export interface StockData {
  menu: MenuItem[];
}
export function generateSN(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CS-${dateStr}-${randomNum}`;
}

// Default stock data
const defaultStock: MenuItem[] = [
  {
    id: "cappuccino",
    name: "Cappuccino",
    price: 25000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Classic Italian coffee with steamed milk foam"
  },
  {
    id: "espresso",
    name: "Espresso",
    price: 20000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Strong and concentrated coffee shot"
  },
  {
    id: "latte",
    name: "Latte",
    price: 28000,
    stock: 8,
    image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Smooth coffee with steamed milk"
  },
  {
    id: "americano",
    name: "Americano",
    price: 22000,
    stock: 12,
    image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Espresso diluted with hot water"
  },
  {
    id: "mocha",
    name: "Mocha",
    price: 30000,
    stock: 6,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Chocolate flavored coffee with milk"
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    price: 32000,
    stock: 5,
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Vanilla syrup, espresso, and caramel"
  }
];

// Load stock from localStorage or default data
export async function loadStock(): Promise<MenuItem[]> {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('coffee_stock');
  if (stored) {
    return JSON.parse(stored);
  }
  // Return default stock data
  return defaultStock;
}

// Save stock to localStorage
export function saveStock(stock: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('coffee_stock', JSON.stringify(stock));
}

// Load orders from localStorage
export function loadOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('coffee_orders');
  return stored ? JSON.parse(stored) : [];
}

// Save orders to localStorage
export function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('coffee_orders', JSON.stringify(orders));
}

// Create WhatsApp message
export function createWhatsAppMessage(order: Order): string {
  const itemsText = order.items.map(item =>
    `${item.name} x${item.quantity} = Rp${(item.price * item.quantity).toLocaleString('id-ID')}`
  ).join('\n');

  return `*PESANAN BARU - ${order.sn}*

${itemsText}

*Total: Rp${order.total.toLocaleString('id-ID')}*
*Status: ${order.status}*

Terima kasih telah memesan di Pidey Coffee!`;
}

// Update stock after order
export function updateStockAfterOrder(stock: MenuItem[], orderItems: OrderItem[]): MenuItem[] {
  return stock.map(item => {
    const orderItem = orderItems.find(order => order.id === item.id);
    if (orderItem) {
      return { ...item, stock: Math.max(0, item.stock - orderItem.quantity) };
    }
    return item;
  });
}

// Update order status
export function updateOrderStatus(sn: string, newStatus: Order['status']): void {
  const orders = loadOrders();
  const updatedOrders = orders.map(order =>
    order.sn === sn ? { ...order, status: newStatus } : order
  );
  saveOrders(updatedOrders);
}

// Get order by SN
export function getOrderBySN(sn: string): Order | null {
  const orders = loadOrders();
  return orders.find(order => order.sn === sn) || null;
}