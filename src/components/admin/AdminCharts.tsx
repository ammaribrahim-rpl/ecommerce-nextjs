'use client'

import React, { useState, useMemo } from 'react'
import {
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingCart,
  ChevronDown,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Layers,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils/format'

interface Order {
  id: string
  created_at: string
  total_akhir: number
  status_order: string
  status_pembayaran: string
  metode_pembayaran?: string | null
  notransaksi?: string
}

interface AdminChartsProps {
  orders: Order[]
  stats: {
    totalRevenue: number
    totalOrders: number
    pendingOrders: number
    processingOrders: number
    shippedOrders: number
    deliveredOrders: number
    totalProducts: number
  }
}

/**
 * Generate smooth bezier curve path for SVG
 */
function getSmoothCurvePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export default function AdminCharts({ orders, stats }: AdminChartsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'month'>('7d')
  const [metricMode, setMetricMode] = useState<'revenue' | 'orders'>('revenue')
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number
    dateLabel: string
    revenue: number
    ordersCount: number
    x: number
    y: number
  } | null>(null)

  // ─────────────────────────────────────────────────────────────
  // 1. COMPUTE SALES DETAILS TIME SERIES DATA
  // ─────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const now = new Date()
    const daysCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 14
    const result: {
      dateKey: string
      label: string
      fullDate: string
      revenue: number
      ordersCount: number
    }[] = []

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateKey = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('id-ID', {
        weekday: timeRange === '7d' ? 'short' : undefined,
        day: 'numeric',
        month: 'short',
      })
      const fullDate = d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      // Find matching orders
      const dayOrders = orders.filter((o) => o.created_at?.startsWith(dateKey))
      const revenue = dayOrders.reduce(
        (sum, o) => sum + (Number(o.total_akhir) || 0),
        0
      )

      result.push({
        dateKey,
        label,
        fullDate,
        revenue,
        ordersCount: dayOrders.length,
      })
    }

    return result
  }, [orders, timeRange])

  // Chart coordinate mapping
  const width = 820
  const height = 260
  const paddingLeft = 60
  const paddingRight = 30
  const paddingTop = 25
  const paddingBottom = 45

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Values based on selected metric
  const values = chartData.map((d) =>
    metricMode === 'revenue' ? d.revenue : d.ordersCount
  )
  const rawMax = Math.max(...values, 0)
  // Give headroom so peak point doesn't clip
  const maxValue = rawMax === 0 ? (metricMode === 'revenue' ? 1000000 : 5) : rawMax * 1.25

  // Map to SVG coordinates
  const points = useMemo(() => {
    if (chartData.length === 0) return []
    const step = chartWidth / (chartData.length - 1 || 1)

    return chartData.map((d, idx) => {
      const val = metricMode === 'revenue' ? d.revenue : d.ordersCount
      const x = paddingLeft + idx * step
      const y = paddingTop + chartHeight - (val / maxValue) * chartHeight
      return { x, y, data: d }
    })
  }, [chartData, chartWidth, chartHeight, maxValue, metricMode])

  const linePath = useMemo(() => getSmoothCurvePath(points), [points])

  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    const first = points[0]
    const last = points[points.length - 1]
    const bottomY = paddingTop + chartHeight
    return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
  }, [linePath, points, chartHeight])

  // Total in current period
  const periodTotalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
  const periodTotalOrders = chartData.reduce((sum, d) => sum + d.ordersCount, 0)

  // ─────────────────────────────────────────────────────────────
  // 2. DONUT CHART (ORDER STATUS DISTRIBUTION)
  // ─────────────────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const ordered = orders.filter((o) => o.status_order === 'ordered').length
    const processing = orders.filter((o) => o.status_order === 'processing').length
    const shipped = orders.filter((o) => o.status_order === 'shipped').length
    const delivered = orders.filter((o) => o.status_order === 'delivered').length
    const cancelled = orders.filter((o) => o.status_order === 'cancelled').length
    const total = orders.length || 1 // Avoid divide by zero

    return [
      {
        key: 'delivered',
        label: 'Selesai',
        count: delivered,
        percent: Math.round((delivered / total) * 100),
        color: '#00B69B',
        bg: 'bg-emerald-500',
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      },
      {
        key: 'processing',
        label: 'Diproses',
        count: processing,
        percent: Math.round((processing / total) * 100),
        color: '#FF9500',
        bg: 'bg-amber-500',
        icon: <Clock className="h-3.5 w-3.5" />,
      },
      {
        key: 'shipped',
        label: 'Dikirim',
        count: shipped,
        percent: Math.round((shipped / total) * 100),
        color: '#8B5CF6',
        bg: 'bg-purple-500',
        icon: <Truck className="h-3.5 w-3.5" />,
      },
      {
        key: 'ordered',
        label: 'Dipesan',
        count: ordered,
        percent: Math.round((ordered / total) * 100),
        color: '#4379EE',
        bg: 'bg-blue-500',
        icon: <ShoppingCart className="h-3.5 w-3.5" />,
      },
      {
        key: 'cancelled',
        label: 'Dibatalkan',
        count: cancelled,
        percent: Math.round((cancelled / total) * 100),
        color: '#EF4444',
        bg: 'bg-red-500',
        icon: <XCircle className="h-3.5 w-3.5" />,
      },
    ]
  }, [orders])

  // Donut SVG circumference math
  const radius = 62
  const strokeWidth = 20
  const circumference = 2 * Math.PI * radius
  let accumulatedPercent = 0

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* ── 1. MAIN SALES DETAILS AREA/LINE CHART (2 COLS) ── */}
      <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#4379EE]">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-gray-900">
                Grafik Penjualan (Sales Details)
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Tren omset harian dan aktivitas pesanan yang masuk ke toko
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Metric Toggle: Revenue vs Orders */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMetricMode('revenue')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  metricMode === 'revenue'
                    ? 'bg-white text-[#4379EE] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Omset (Rp)
              </button>
              <button
                type="button"
                onClick={() => setMetricMode('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  metricMode === 'orders'
                    ? 'bg-white text-[#4379EE] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Order (Qty)
              </button>
            </div>

            {/* Time Period Selector */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 pr-8 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:border-[#4379EE] focus:outline-hidden cursor-pointer"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="month">14 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Period Summary Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 pb-2">
          <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-100/60">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Total Periode
            </span>
            <p className="text-lg font-black text-gray-900 mt-0.5">
              {formatRupiah(periodTotalRevenue)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-100/60">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Pesanan Masuk
            </span>
            <p className="text-lg font-black text-gray-900 mt-0.5">
              {periodTotalOrders} Transaksi
            </p>
          </div>
          <div className="rounded-xl bg-orange-50/60 p-3 border border-orange-100/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
              Rata-rata Harian
            </span>
            <p className="text-lg font-black text-gray-900 mt-0.5">
              {formatRupiah(Math.round(periodTotalRevenue / chartData.length))}
            </p>
          </div>
        </div>

        {/* Responsive Interactive SVG Line/Area Chart */}
        <div className="relative mt-4 w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Area Linear Gradient (DashStack Signature Indigo/Blue) */}
              <linearGradient id="dashstackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4379EE" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#4880FF" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#4880FF" stopOpacity="0.0" />
              </linearGradient>

              {/* Drop Shadow for Line */}
              <filter id="lineShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#4379EE" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + chartHeight * (1 - ratio)
              const val = Math.round(maxValue * ratio)
              const displayVal =
                metricMode === 'revenue'
                  ? val >= 1000000
                    ? `${(val / 1000000).toFixed(1)}jt`
                    : val >= 1000
                    ? `${Math.round(val / 1000)}rb`
                    : '0'
                  : `${val}`

              return (
                <g key={ratio}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#EAEAEA"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    fill="#9CA3AF"
                    fontFamily="inherit"
                  >
                    {displayVal}
                  </text>
                </g>
              )
            })}

            {/* Area Fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#dashstackGradient)"
                className="transition-all duration-300"
              />
            )}

            {/* Main Spline Curve Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#4379EE"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineShadow)"
                className="transition-all duration-300"
              />
            )}

            {/* Vertical crosshair line on hover */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="#4379EE"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            )}

            {/* Interactive Data Point Markers */}
            {points.map((pt, idx) => {
              const isHovered = hoveredPoint?.index === idx
              return (
                <g key={idx}>
                  {/* Invisible wide hit area for easy hover */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        index: idx,
                        dateLabel: pt.data.label,
                        revenue: pt.data.revenue,
                        ordersCount: pt.data.ordersCount,
                        x: pt.x,
                        y: pt.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Dot ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#4379EE' : '#FFFFFF'}
                    stroke="#4379EE"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-150 pointer-events-none"
                  />
                </g>
              )
            })}

            {/* X-Axis Labels */}
            {points.map((pt, idx) => {
              // Show label if reasonable gap
              const stepInterval = timeRange === '30d' ? 4 : timeRange === 'month' ? 2 : 1
              if (idx % stepInterval !== 0 && idx !== points.length - 1) return null

              return (
                <text
                  key={idx}
                  x={pt.x}
                  y={height - 15}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#6B7280"
                  fontFamily="inherit"
                >
                  {pt.data.label}
                </text>
              )
            })}
          </svg>

          {/* Floating HTML Tooltip on hover */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 rounded-xl bg-[#1B2559] px-3.5 py-2 text-white shadow-xl animate-fade-in border border-white/10"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100}%`,
              }}
            >
              <p className="text-[10px] font-medium text-blue-200">
                {chartData[hoveredPoint.index]?.fullDate}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-black text-emerald-400">
                  {formatRupiah(hoveredPoint.revenue)}
                </span>
                <span className="text-[10px] text-gray-300">
                  ({hoveredPoint.ordersCount} pesanan)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. ORDER STATUS DISTRIBUTION DONUT CHART (1 COL) ── */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
        {/* Header */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-[#FA8232]">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Distribusi Pesanan
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Status pemenuhan seluruh pesanan toko
          </p>
        </div>

        {/* Donut Graphic */}
        <div className="relative flex items-center justify-center py-6">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {statusCounts.map((slice) => {
              const strokeLength = (slice.percent / 100) * circumference
              const strokeDasharray = `${strokeLength} ${circumference}`
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
              accumulatedPercent += slice.percent

              if (slice.count === 0) return null

              return (
                <circle
                  key={slice.key}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-80"
                />
              )
            })}
          </svg>

          {/* Donut Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-black text-gray-900">{orders.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Order
            </p>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 pt-2 border-t border-gray-100">
          {statusCounts.map((item) => (
            <div key={item.key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-gray-900">{item.count}</span>
                <span className="text-[10px] text-gray-400 min-w-8 text-right">
                  {orders.length > 0 ? `${item.percent}%` : '0%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
