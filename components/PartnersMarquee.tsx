'use client'

const partners = [
  // Credit Unions
  { name: 'Redstone Federal Credit Union', category: 'Credit Union' },
  { name: 'America First Credit Union', category: 'Credit Union' },
  { name: 'Navy Federal', category: 'Credit Union' },
  { name: 'Pentagon Federal', category: 'Credit Union' },
  // Finance Giants
  { name: 'Chase Auto', category: 'Finance' },
  { name: 'Ally Financial', category: 'Finance' },
  { name: 'Santander Consumer', category: 'Finance' },
  { name: 'Capital One Auto', category: 'Finance' },
  { name: 'Wells Fargo Auto', category: 'Finance' },
  // Major Dealers & Buyers
  { name: 'Carvana', category: 'Dealer' },
  { name: 'DriveTime', category: 'Dealer' },
  { name: 'CarMax', category: 'Dealer' },
  { name: 'AutoNation', category: 'Dealer' },
]

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
        <div className="flex animate-marquee">
          {doubledPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 mx-8 flex flex-col items-center justify-center"
            >
              <div className="bg-white rounded-lg shadow-sm px-6 py-4 min-w-[180px] text-center border border-gray-200">
                <p className="font-semibold text-slate-brand text-sm">{partner.name}</p>
                <p className="text-xs text-gray-400 mt-1">{partner.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
