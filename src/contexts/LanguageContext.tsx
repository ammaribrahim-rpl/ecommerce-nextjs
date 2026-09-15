'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'id' | 'en' | 'ja' | 'ar'

export interface LanguageOption {
  code: Language
  label: string
  flag: string
  sublabel: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩', sublabel: 'ID (Default)' },
  { code: 'en', label: 'English', flag: '🇬🇧', sublabel: 'EN' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', sublabel: 'JA' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', sublabel: 'AR' },
]

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: (key) => key,
})

export function useLanguage() {
  return useContext(LanguageContext)
}

// ─────────────────────────────────────────────────────────────
// TRANSLATION DICTIONARIES
// Default language is INDONESIAN ('id')
// ─────────────────────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
  id: {
    // Top Announcement Bar
    'top.badge': 'Promo Spesial',
    'top.upto': 'Hemat hingga',
    'top.off': 'OFF',
    'top.shop_now': 'BELANJA SEKARANG',

    // Navbar
    'nav.welcome': 'Selamat datang di Karisma Grosir — Belanja Grosir & Eceran Terpercaya',
    'nav.follow': 'Ikuti kami:',
    'nav.language': 'Bahasa',
    'nav.currency': 'Mata Uang',
    'nav.search_placeholder': 'Cari produk apa saja...',
    'nav.all_categories': 'Semua Kategori',
    'nav.all_category_btn': 'Semua Kategori',
    'nav.see_all_categories': '⚡ Lihat Semua Kategori',
    'nav.loading_categories': 'Memuat kategori...',
    'nav.track_order': 'Lacak Pesanan',
    'nav.compare': 'Bandingkan',
    'nav.customer_support': 'Layanan Pelanggan',
    'nav.need_help': 'Bantuan',
    'nav.sign_in': 'Masuk',
    'nav.my_orders': 'Pesanan Saya',
    'nav.account_settings': 'Pengaturan Akun',
    'nav.logout': 'Keluar (Logout)',
    'nav.admin_dashboard': 'Dashboard Admin',
    'nav.open_store': 'Buka Toko Depan',
    'nav.shopping_cart': 'Keranjang belanja:',
    'nav.items': 'item',
    'nav.all_products': 'Semua Produk',

    // Common
    'common.loading': 'Memuat...',
    'common.error': 'Terjadi kesalahan',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Hapus',
    'common.add': 'Tambah',
    'common.search': 'Cari',
    'common.submit': 'Kirim',
    'common.back': 'Kembali',
    'common.see_all': 'Lihat Semua',
    'common.home': 'Beranda',

    // Cart
    'cart.title': 'Keranjang Belanja',
    'cart.empty': 'Keranjang belanja Anda masih kosong',
    'cart.checkout': 'Lanjut ke Pembayaran',
    'cart.total': 'Total Akhir',
    'cart.start_shopping': 'Mulai Belanja Sekarang',

    // Track Order
    'track.title': 'Lacak Pesanan Saya',
    'track.subtitle': 'Pantau status dan pengiriman semua pesananmu secara real-time.',
    'track.no_orders': 'Belum Ada Pesanan',
    'track.start_shopping': 'Mulai Belanja',
    'track.details': 'Detail Pesanan',
    'track.step.created': 'Pesanan Dibuat',
    'track.step.packing': 'Sedang Dikemas',
    'track.step.shipping': 'Dalam Pengiriman',
    'track.step.delivered': 'Terkirim',

    // Compare
    'compare.title': 'Bandingkan Produk',
    'compare.subtitle': 'Bandingkan harga, stok, dan spesifikasi produk sekaligus.',
    'compare.empty': 'Daftar Perbandingan Masih Kosong',
    'compare.add_product': 'Tambah Produk ke Perbandingan',
    'compare.best_price': 'Harga Terbaik',
    'compare.search_placeholder': 'Ketik nama produk untuk dibandingkan...',
    'compare.clear_all': 'Hapus Semua',

    // Auth
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.email': 'Alamat Email',
    'auth.password': 'Kata Sandi',
    'auth.login_btn': 'Masuk Sekarang',
    'auth.no_account': 'Belum punya akun?',
    'auth.register_now': 'Daftar Sekarang',

    // Footer
    'footer.desc': 'Platform e-commerce terpercaya untuk kebutuhan ibu, bayi, dan keluarga. Produk asli, harga terjangkau, pengiriman cepat.',
    'footer.top_categories': 'Top Kategori',
    'footer.quick_links': 'Tautan Cepat',
    'footer.popular_tags': 'Tag Populer',
    'footer.payment_methods': 'Metode Pembayaran',
    'footer.copyright': '© {year} Karisma Store. Semua Hak Dilindungi.',
    'footer.home': 'Beranda',
    'footer.all_products': 'Semua Produk',
    'footer.cart': 'Keranjang Belanja',
    'footer.wishlist': 'Wishlist',
    'footer.order_status': 'Status Pesanan',
    'footer.contact': 'Hubungi Kami',
  },

  en: {
    // Top Announcement Bar
    'top.badge': 'Special Deal',
    'top.upto': 'Save up to',
    'top.off': 'OFF',
    'top.shop_now': 'SHOP NOW',

    // Navbar
    'nav.welcome': 'Welcome to Karisma Grosir — Trusted Wholesale & Retail Marketplace',
    'nav.follow': 'Follow us:',
    'nav.language': 'Language',
    'nav.currency': 'Currency',
    'nav.search_placeholder': 'Search for anything...',
    'nav.all_categories': 'All Categories',
    'nav.all_category_btn': 'All Categories',
    'nav.see_all_categories': '⚡ View All Categories',
    'nav.loading_categories': 'Loading categories...',
    'nav.track_order': 'Track Order',
    'nav.compare': 'Compare',
    'nav.customer_support': 'Customer Support',
    'nav.need_help': 'Need Help',
    'nav.sign_in': 'Sign In',
    'nav.my_orders': 'My Orders',
    'nav.account_settings': 'Account Settings',
    'nav.logout': 'Logout',
    'nav.admin_dashboard': 'Admin Dashboard',
    'nav.open_store': 'Open Storefront',
    'nav.shopping_cart': 'Shopping cart:',
    'nav.items': 'items',
    'nav.all_products': 'All Products',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.see_all': 'See All',
    'common.home': 'Home',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your shopping cart is currently empty',
    'cart.checkout': 'Proceed to Checkout',
    'cart.total': 'Total',
    'cart.start_shopping': 'Start Shopping Now',

    // Track Order
    'track.title': 'Track My Orders',
    'track.subtitle': 'Monitor delivery status and history of all your orders in real-time.',
    'track.no_orders': 'No Orders Yet',
    'track.start_shopping': 'Start Shopping',
    'track.details': 'Order Details',
    'track.step.created': 'Order Created',
    'track.step.packing': 'Packing',
    'track.step.shipping': 'In Transit',
    'track.step.delivered': 'Delivered',

    // Compare
    'compare.title': 'Compare Products',
    'compare.subtitle': 'Compare prices, stock, and specifications simultaneously.',
    'compare.empty': 'Comparison List is Empty',
    'compare.add_product': 'Add Product to Compare',
    'compare.best_price': 'Best Price',
    'compare.search_placeholder': 'Type product name to compare...',
    'compare.clear_all': 'Clear All',

    // Auth
    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.login_btn': 'Sign In Now',
    'auth.no_account': "Don't have an account?",
    'auth.register_now': 'Sign Up Now',

    // Footer
    'footer.desc': 'Trusted e-commerce platform for baby, maternal, and family essentials. High quality, great prices, speedy delivery.',
    'footer.top_categories': 'Top Categories',
    'footer.quick_links': 'Quick Links',
    'footer.popular_tags': 'Popular Tags',
    'footer.payment_methods': 'Payment Methods',
    'footer.copyright': '© {year} Karisma Store. All Rights Reserved.',
    'footer.home': 'Home',
    'footer.all_products': 'All Products',
    'footer.cart': 'Shopping Cart',
    'footer.wishlist': 'Wishlist',
    'footer.order_status': 'Order Status',
    'footer.contact': 'Contact Us',
  },

  ja: {
    // Top Announcement Bar
    'top.badge': '特別セール',
    'top.upto': '最大',
    'top.off': 'OFF',
    'top.shop_now': '今すぐ購入',

    // Navbar
    'nav.welcome': 'カリスマ・グロシルへようこそ — 信頼できる卸売＆小売マーケット',
    'nav.follow': 'フォロー:',
    'nav.language': '言語',
    'nav.currency': '通貨',
    'nav.search_placeholder': '商品を検索...',
    'nav.all_categories': '全カテゴリー',
    'nav.all_category_btn': '全カテゴリー',
    'nav.see_all_categories': '⚡ 全カテゴリーを見る',
    'nav.loading_categories': 'カテゴリーを読み込み中...',
    'nav.track_order': '注文追跡',
    'nav.compare': '商品比較',
    'nav.customer_support': 'カスタマーサポート',
    'nav.need_help': 'ヘルプ',
    'nav.sign_in': 'ログイン',
    'nav.my_orders': '注文履歴',
    'nav.account_settings': 'アカウント設定',
    'nav.logout': 'ログアウト',
    'nav.admin_dashboard': '管理ダッシュボード',
    'nav.open_store': 'ストアを開く',
    'nav.shopping_cart': 'ショッピングカート:',
    'nav.items': '点',
    'nav.all_products': 'すべての商品',

    // Common
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.add': '追加',
    'common.search': '検索',
    'common.submit': '送信',
    'common.back': '戻る',
    'common.see_all': 'すべて見る',
    'common.home': 'ホーム',

    // Cart
    'cart.title': 'ショッピングカート',
    'cart.empty': 'ショッピングカートは空です',
    'cart.checkout': 'チェックアウトへ進む',
    'cart.total': '合計金額',
    'cart.start_shopping': '今すぐショッピングを始める',

    // Track Order
    'track.title': '注文履歴・追跡',
    'track.subtitle': 'ご注文の配送状況をリアルタイムで確認できます。',
    'track.no_orders': 'ご注文履歴がありません',
    'track.start_shopping': 'お買い物を始める',
    'track.details': '注文詳細',
    'track.step.created': '注文完了',
    'track.step.packing': '梱包中',
    'track.step.shipping': '配送中',
    'track.step.delivered': '配達完了',

    // Compare
    'compare.title': '商品を比較',
    'compare.subtitle': '価格、在庫、仕様をまとめて比較できます。',
    'compare.empty': '比較リストは空です',
    'compare.add_product': '比較する商品を追加',
    'compare.best_price': '最安値',
    'compare.search_placeholder': '比較する商品名を入力...',
    'compare.clear_all': 'すべてクリア',

    // Auth
    'auth.login': 'ログイン',
    'auth.register': '新規登録',
    'auth.email': 'メールアドレス',
    'auth.password': 'パスワード',
    'auth.login_btn': '今すぐログイン',
    'auth.no_account': 'アカウントをお持ちでないですか？',
    'auth.register_now': '今すぐ新規登録',

    // Footer
    'footer.desc': 'ベビー・ママ・ファミリーのための信頼できるeコマース。正規品、お求めやすい価格、迅速な配送。',
    'footer.top_categories': 'トップカテゴリー',
    'footer.quick_links': 'クイックリンク',
    'footer.popular_tags': '人気タグ',
    'footer.payment_methods': 'お支払い方法',
    'footer.copyright': '© {year} Karisma Store. 全著作権所有。',
    'footer.home': 'ホーム',
    'footer.all_products': 'すべての商品',
    'footer.cart': 'ショッピングカート',
    'footer.wishlist': 'お気に入り',
    'footer.order_status': '注文状況',
    'footer.contact': 'お問い合わせ',
  },

  ar: {
    // Top Announcement Bar
    'top.badge': 'عرض خاص',
    'top.upto': 'وفر حتى',
    'top.off': 'خصم',
    'top.shop_now': 'تسوق الآن',

    // Navbar
    'nav.welcome': 'مرحباً بكم في كاريزما — سوق الجملة والتجزئة الموثوق',
    'nav.follow': 'تابعنا:',
    'nav.language': 'اللغة',
    'nav.currency': 'العملة',
    'nav.search_placeholder': 'ابحث عن أي منتج...',
    'nav.all_categories': 'جميع الفئات',
    'nav.all_category_btn': 'جميع الفئات',
    'nav.see_all_categories': '⚡ عرض جميع الفئات',
    'nav.loading_categories': 'جاري تحميل الفئات...',
    'nav.track_order': 'تتبع الطلب',
    'nav.compare': 'مقارنة',
    'nav.customer_support': 'دعم العملاء',
    'nav.need_help': 'تحتاج مساعدة',
    'nav.sign_in': 'تسجيل الدخول',
    'nav.my_orders': 'طلباتي',
    'nav.account_settings': 'إعدادات الحساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.admin_dashboard': 'لوحة الإدارة',
    'nav.open_store': 'افتح المتجر',
    'nav.shopping_cart': 'سلة التسوق:',
    'nav.items': 'عناصر',
    'nav.all_products': 'جميع المنتجات',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.submit': 'إرسال',
    'common.back': 'رجوع',
    'common.see_all': 'عرض الكل',
    'common.home': 'الرئيسية',

    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق الخاصة بك فارغة حالياً',
    'cart.checkout': 'متابعة الشراء',
    'cart.total': 'المجموع الإجمالي',
    'cart.start_shopping': 'ابدأ التسوق الآن',

    // Track Order
    'track.title': 'تتبع طلباتي',
    'track.subtitle': 'تابع حالة شحن وتوصيل جميع طلباتك في الوقت الفعلي.',
    'track.no_orders': 'لا توجد طلبات بعد',
    'track.start_shopping': 'ابدأ التسوق',
    'track.details': 'تفاصيل الطلب',
    'track.step.created': 'تم إنشاء الطلب',
    'track.step.packing': 'جاري التجهيز',
    'track.step.shipping': 'قيد الشحن',
    'track.step.delivered': 'تم التسليم',

    // Compare
    'compare.title': 'مقارنة المنتجات',
    'compare.subtitle': 'قارن الأسعار والمخزون والمواصفات في وقت واحد.',
    'compare.empty': 'قائمة المقارنة فارغة حالياً',
    'compare.add_product': 'إضافة منتج للمقارنة',
    'compare.best_price': 'أفضل سعر',
    'compare.search_placeholder': 'اكتب اسم المنتج للمقارنة...',
    'compare.clear_all': 'مسح الكل',

    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.login_btn': 'تسجيل الدخول الآن',
    'auth.no_account': 'ليس لديك حساب؟',
    'auth.register_now': 'سجل الآن',

    // Footer
    'footer.desc': 'منصة التجارة الإلكترونية الموثوقة لمستلزمات الأطفال والأمهات والأسرة. جودة عالية وأسعار مناسبة وتوصيل سريع.',
    'footer.top_categories': 'أهم الفئات',
    'footer.quick_links': 'روابط سريعة',
    'footer.popular_tags': 'الوسوم الشائعة',
    'footer.payment_methods': 'طرق الدفع',
    'footer.copyright': '© {year} Karisma Store. جميع الحقوق محفوظة.',
    'footer.home': 'الرئيسية',
    'footer.all_products': 'جميع المنتجات',
    'footer.cart': 'سلة التسوق',
    'footer.wishlist': 'قائمة الرغبات',
    'footer.order_status': 'حالة الطلب',
    'footer.contact': 'اتصل بنا',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')

  // Load saved preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('karisma_language') as Language | null
      if (saved && translations[saved]) {
        setLanguageState(saved)
        document.documentElement.lang = saved
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('karisma_language', lang)
    } catch {
      // LocalStorage unavailable
    }
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] ?? translations['id']?.[key] ?? key

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal))
      })
    }

    return text
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
