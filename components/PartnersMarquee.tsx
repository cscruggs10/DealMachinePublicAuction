'use client'

import { useState } from 'react'

interface Partner {
  name: string
  shortName: string
  logo?: string
  category: 'Credit Union' | 'Finance' | 'Dealer'
}

const partners: Partner[] = [
  // Credit Unions
  { name: 'Redstone Federal Credit Union', shortName: 'Redstone FCU', category: 'Credit Union' },
  { name: 'America First Credit Union', shortName: 'America First', category: 'Credit Union' },
  { name: 'Navy Federal Credit Union', shortName: 'Navy Federal', category: 'Credit Union' },
  { name: 'Pentagon Federal Credit Union', shortName: 'PenFed', category: 'Credit Union' },
  // Finance Giants
  { name: 'Chase Auto Finance', shortName: 'Chase', category: 'Finance' },
  { name: 'Ally Financial', shortName: 'Ally', category: 'Finance' },
  { name: 'Santander Consumer USA', shortName: 'Santander', category: 'Finance' },
  { name: 'Capital One Auto Finance', shortName: 'Capital One', category: 'Finance' },
  { name: 'Wells Fargo Auto', shortName: 'Wells Fargo', category: 'Finance' },
  // Major Dealers & Buyers
  { name: 'Carvana', shortName: 'Carvana', category: 'Dealer' },
  { name: 'DriveTime Automotive', shortName: 'DriveTime', category: 'Dealer' },
  { name: 'CarMax', shortName: 'CarMax', category: 'Dealer' },
  { name: 'AutoNation', shortName: 'AutoNation', category: 'Dealer' },
]

const categoryColors = {
  'Credit Union': 'bg-blue-600',
  'Finance': 'bg-green-600',
  'Dealer': 'bg-purple-600',
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 min-w-[180px] h-24 flex flex-col items-center justify-center border border-gray-200 hover:shadow-lg hover:border-action-orange transition-all duration-300">
      <span className="font-bold text-slate-brand text-center leading-tight">
        {partner.shortName}
      </span>
      <span className={`text-xs text-white px-2 py-0.5 rounded-full mt-2 ${categoryColors[partner.category]}`}>
        {partner.category}
      </span>
    </div>
  )
}

export default function PartnersMarquee() {
  // Double the partners array for seamless loop
  const doubledPartners = [...partners, ...partners]

  return (
    <div className="relative">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-100 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-100 to-transparent z-10" />

      {/* Scrolling container */}
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee items-center gap-6 py-2">
          {doubledPartners.map((partner, index) => (
            <div key={`${partner.name}-${index}`} className="flex-shrink-0">
              <PartnerCard partner={partner} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
