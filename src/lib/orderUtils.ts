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

// Generate unique serial number
export function generateSN(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CS-${dateStr}-${randomNum}`;
}

// Load stock from localStorage or JSON file
export function loadStock(): MenuItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('coffee_stock');
  if (stored) {
    return JSON.parse(stored);
  }
  // Fallback to default stock
  return [
    {
      id: "cappuccino",
      name: "Cappuccino",
      price: 25000,
      stock: 10,
      image: "/images/cappuccino.jpg",
      description: "Classic Italian coffee with steamed milk foam"
    },
    {
      id: "espresso",
      name: "Espresso",
      price: 20000,
      stock: 15,
      image: "/images/espresso.jpg",
      description: "Strong and concentrated coffee shot"
    },
    {
      id: "latte",
      name: "Latte",
      price: 28000,
      stock: 8,
      image: "/images/latte.jpg",
      description: "Smooth coffee with steamed milk"
    },
    {
      id: "americano",
      name: "Americano",
      price: 22000,
      stock: 12,
      image: "/images/americano.jpg",
      description: "Espresso diluted with hot water"
    },
    {
      id: "mocha",
      name: "Mocha",
      price: 30000,
      stock: 6,
      image: "/images/mocha.jpg",
      description: "Chocolate flavored coffee with milk"
    },
    {
      id: "caramel-macchiato",
      name: "Caramel Macchiato",
      price: 32000,
      stock: 5,
      image: "/images/caramel-macchiato.jpg",
      description: "Vanilla syrup, espresso, and caramel"
    }
  ];
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