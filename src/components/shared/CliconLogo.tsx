import React from 'react'
import Link from 'next/link'

interface CliconLogoProps {
  variant?: 'white' | 'dark' | 'colored'
  className?: string
  href?: string
}

export default function CliconLogo({
  variant = 'white',
  className = '',
  href = '/',
}: CliconLogoProps) {
  const isWhite = variant === 'white'
  const textColor = isWhite ? 'text-white' : 'text-[#191C1F]'

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Clicon Circle Emblem (Icon from Figma SVG) */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-105"
      >
        <circle cx="24" cy="24" r="24" fill="#FA8232" />
        <circle cx="24" cy="24" r="15" stroke="white" strokeWidth="4" />
        <circle cx="24" cy="24" r="6" fill="white" />
      </svg>

      {/* CLICON wordmark */}
      <span className={`text-2xl sm:text-[26px] font-black tracking-wider uppercase font-sans ${textColor}`}>
        CLICON
      </span>
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} className="group inline-flex items-center" aria-label="Clicon Home">
      {content}
    </Link>
  )
}
