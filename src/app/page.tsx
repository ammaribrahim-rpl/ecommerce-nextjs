import React from 'react'
import { getFeaturedProducts } from '@/services/products.service'
import HeroSection from '@/components/home/HeroSection'
import FeatureHighlights from '@/components/home/FeatureHighlights'
import BestDealsSection from '@/components/home/BestDealsSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProductsTabs from '@/components/home/FeaturedProductsTabs'
import NewsletterSection from '@/components/home/NewsletterSection'

export const metadata = {
  title: 'Karisma Store — Belanja Kebutuhan Keluarga Lengkap & Terpercaya',
  description:
    'Temukan ribuan produk kebutuhan ibu & bayi, susu formula, popok, makanan dan perlengkapan harian dengan harga terbaik dan pengiriman cepat di Karisma Store.',
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(16)

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F4F5]">
      {/* 1. Hero Slider */}
      <HeroSection />

      {/* 2. Feature Highlights (4 badge keunggulan) */}
      <FeatureHighlights />

      {/* 3. Best Deals + Countdown */}
      <BestDealsSection products={featuredProducts} />

      {/* 4. Shop with Categories */}
      <CategoryGrid />

      {/* 5. Featured Products (tabbed) */}
      <FeaturedProductsTabs products={featuredProducts} />

      {/* 6. Newsletter + Brand logos */}
      <NewsletterSection />
    </div>
  )
}
