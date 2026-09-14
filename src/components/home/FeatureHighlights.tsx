import React from 'react'
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'

const FEATURES = [
  {
    icon: Truck,
    title: 'Pengiriman Cepat',
    subtitle: 'Langsung ke depan pintu Anda',
    iconBg: '#FFF3EB',
    iconColor: '#FA8232',
  },
  {
    icon: RotateCcw,
    title: 'Retur 24 Jam',
    subtitle: 'Jaminan kepuasan penuh',
    iconBg: '#EEF7FF',
    iconColor: '#2DA5F3',
  },
  {
    icon: ShieldCheck,
    title: 'Pembayaran Aman',
    subtitle: '100% transaksi terenkripsi',
    iconBg: '#F0FFF4',
    iconColor: '#2DB224',
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    subtitle: 'Tim siap membantu kapanpun',
    iconBg: '#FFF3EB',
    iconColor: '#FA8232',
  },
]

export default function FeatureHighlights() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-2">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="flex items-center gap-3 bg-white border border-[#E4E7E9] rounded-sm px-4 py-4 hover:border-[#FA8232]/40 hover:shadow-sm transition-all duration-200"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ background: feat.iconBg }}
                >
                  <Icon className="h-5 w-5 stroke-[1.8]" style={{ color: feat.iconColor }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#191C1F] leading-tight">{feat.title}</p>
                  <p className="text-xs text-[#77878F] mt-0.5 leading-tight">{feat.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
