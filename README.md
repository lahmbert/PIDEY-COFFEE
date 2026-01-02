# ☕ Pidey Coffee Shop

Website coffeeshop modern dengan sistem pemesanan WhatsApp, admin panel, dan stok real-time tanpa database.

## ✨ Fitur Utama

- **🏠 Landing Page** - Hero section dengan menu preview
- **☕ Menu Kopi** - 6 jenis kopi dengan stok real-time
- **🛒 Sistem Order** - Keranjang belanja dengan WhatsApp integration
- **📊 Status Order** - Cek status pesanan dengan Serial Number (SN)
- **👨‍💼 Admin Panel** - Kelola pesanan, menu, dan stok
- **📱 Responsive** - Kompatibel desktop & mobile
- **⚡ Real-time Stock** - Update stok otomatis saat order

## 🚀 Teknologi

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: LocalStorage
- **Deployment**: Vercel Ready
- **Language**: TypeScript

## 🏗️ Struktur Folder

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── menu/page.tsx         # Menu kopi
│   ├── order/page.tsx        # Keranjang & checkout
│   ├── status/page.tsx       # Cek status order
│   └── admin/
│       ├── page.tsx          # Dashboard admin
│       ├── orders/page.tsx   # Kelola pesanan
│       ├── menu/page.tsx     # Kelola menu & stok
│       └── stock/page.tsx    # Redirect ke menu
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── Sidebar.tsx           # Admin sidebar
│   └── MenuCard.tsx          # Card untuk menu item
└── lib/
    ├── orderUtils.ts         # Utility functions
    └── stock.json            # Data stok default
```

## 🛠️ Instalasi & Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd pidey-coffee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:3000
   ```

## 📱 Cara Penggunaan

### Untuk Customer:
1. **Lihat Menu** - Kunjungi halaman Menu untuk melihat kopi tersedia
2. **Tambah ke Keranjang** - Klik "Add to Cart" pada menu yang diinginkan
3. **Checkout** - Pergi ke halaman Order dan klik "Pesan via WhatsApp"
4. **Cek Status** - Gunakan SN untuk melihat progress pesanan

### Untuk Admin:
1. **Login Admin** - Kunjungi `/admin` dengan password `admin123`
2. **Kelola Pesanan** - Update status dari PENDING → PROSES → SUKSES
3. **Kelola Stok** - Edit jumlah stok menu di halaman Menu

## 📋 Menu Tersedia

- ☕ **Cappuccino** - Rp 25.000
- ☕ **Espresso** - Rp 20.000
- ☕ **Latte** - Rp 28.000
- ☕ **Americano** - Rp 22.000
- ☕ **Mocha** - Rp 30.000
- ☕ **Caramel Macchiato** - Rp 32.000

## 🔐 Admin Access

- **URL**: `/admin`
- **Password**: `admin123`
- **Fitur**: Dashboard, Order Management, Stock Management

## 📞 WhatsApp Integration

- **Nomor**: 085334679379
- **Format**: Otomatis generate pesan dengan SN, detail menu, dan total

## 🚀 Deployment ke Vercel

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy di Vercel**
   - Import project dari GitHub
   - Deploy otomatis

## 🎨 UI/UX Features

- **Modern Design** - Clean dan coffee-themed
- **Responsive** - Mobile-first approach
- **Real-time Updates** - Stock dan status update otomatis
- **Intuitive Navigation** - Easy-to-use interface
- **Status Indicators** - Visual status untuk orders

## 🔧 Development Notes

- **No Database** - Semua data disimpan di LocalStorage
- **SN Generation** - Format: CS-YYYYMMDD-XXX
- **Stock Management** - Update otomatis saat order dibuat
- **Admin Authentication** - Simple password-based (bukan untuk production)

## 📝 Lisensi

Proyek ini dibuat untuk keperluan demonstrasi dan edukasi.

---

**Pidey Coffee** - Nikmati kopi terbaik dengan pengalaman modern! ☕✨
