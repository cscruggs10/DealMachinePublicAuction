'use client'

const partners = [
  // Credit Unions
  { name: 'Redstone Federal Credit Union', logo: 'https://logo.clearbit.com/redfcu.org', domain: 'redfcu.org' },
  { name: 'America First Credit Union', logo: 'https://logo.clearbit.com/americafirst.com', domain: 'americafirst.com' },
  { name: 'Navy Federal', logo: 'https://logo.clearbit.com/navyfederal.org', domain: 'navyfederal.org' },
  { name: 'Pentagon Federal', logo: 'https://logo.clearbit.com/penfed.org', domain: 'penfed.org' },
  // Finance Giants
  { name: 'Chase Auto', logo: 'https://logo.clearbit.com/chase.com', domain: 'chase.com' },
  { name: 'Ally Financial', logo: 'https://logo.clearbit.com/ally.com', domain: 'ally.com' },
  { name: 'Santander', logo: 'https://logo.clearbit.com/santander.com', domain: 'santander.com' },
  { name: 'Capital One', logo: 'https://logo.clearbit.com/capitalone.com', domain: 'capitalone.com' },
  { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com', domain: 'wellsfargo.com' },
  // Major Dealers & Buyers
  { name: 'Carvana', logo: 'https://logo.clearbit.com/carvana.com', domain: 'carvana.com' },
  { name: 'DriveTime', logo: 'https://logo.clearbit.com/drivetime.com', domain: 'drivetime.com' },
  { name: 'CarMax', logo: 'https://logo.clearbit.com/carmax.com', domain: 'carmax.com' },
  { name: 'AutoNation', logo: 'https://logo.clearbit.com/autonation.com', domain: 'autonation.com' },
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
        <div className="flex animate-marquee items-center">
          {doubledPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 mx-6"
            >
              <div className="bg-white rounded-lg shadow-sm p-4 min-w-[160px] h-20 flex items-center justify-center border border-gray-200 hover:shadow-md transition-shadow">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 max-w-[140px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `<span class="text-sm font-semibold text-gray-600 text-center">${partner.name}</span>`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
