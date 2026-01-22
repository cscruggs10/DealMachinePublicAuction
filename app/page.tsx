import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getVideoThumbnail } from '@/lib/videoThumbnail'
import CopyVin from '@/components/CopyVin'
import PartnersMarquee from '@/components/PartnersMarquee'

export const dynamic = 'force-dynamic'

async function getActiveVehicles() {
  const now = new Date()

  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: 'ACTIVE',
      saleEvent: {
        OR: [
          { status: 'ACTIVE' },
          { status: 'UPCOMING' },
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
    },
    include: {
      saleEvent: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return vehicles
}

async function getCurrentEvent() {
  const now = new Date()

  const event = await prisma.saleEvent.findFirst({
    where: {
      OR: [
        { status: 'ACTIVE' },
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } },
          ],
        },
      ],
    },
    orderBy: { startDate: 'asc' },
  })

  return event
}

export default async function Home() {
  const vehicles = await getActiveVehicles()
  const currentEvent = await getCurrentEvent()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-brand text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              DEAL MACHINE
              <span className="text-action-orange"> [Public Auctions]</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Wholesale inventory direct from Finance Companies and New Car Trades.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* 50 Years Badge */}
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="w-16 h-16 bg-action-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">50 Years Experience</h3>
                <p className="text-sm text-gray-300">Half a century of wholesale excellence and trusted partnerships.</p>
              </div>

              {/* $800 Rule Badge */}
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="w-16 h-16 bg-action-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">The $800 Rule</h3>
                <p className="text-sm text-gray-300">Mechanical protection you can count on. We fix it or take it back.</p>
              </div>

              {/* Satisfaction Badge */}
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="w-16 h-16 bg-action-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Satisfaction Guarantee</h3>
                <p className="text-sm text-gray-300">If you don't like it, you can't have it. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <section className="bg-gray-100 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wide">
            Trusted Supply Partners
          </p>
        </div>
        <PartnersMarquee />
      </section>

      {/* Wholesale Edge Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-brand mb-6">
            The Wholesale Edge
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We don't buy from other auctions. <span className="font-bold text-deep-blue">We ARE the source.</span> For 50 years, the biggest names in auto—Carvana, DriveTime, and national franchises—have relied on us for their inventory. Now, we're opening that pipeline to you.
          </p>
        </div>
      </section>

      {/* Mechanical Assurance Section */}
      <section className="bg-deep-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-action-orange text-white text-sm font-bold px-4 py-1 rounded-full mb-6">
            THE $800 RULE
          </div>
          <h2 className="text-3xl font-bold mb-6">
            Bid with Confidence. Drive with Assurance.
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed mb-8">
            These are real cars from the real world. They aren't perfect, but they are transparent. We disclose everything. If a major mechanical issue over $800 is found that we didn't disclose, we fix it or we take it back.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
            <svg className="w-6 h-6 text-action-orange" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Full Transparency Guaranteed</span>
          </div>
        </div>
      </section>

      {/* Deal Machine Oath Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-brand mb-6">
            The Deal Machine Oath
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-action-orange">
            <p className="text-2xl font-bold text-slate-brand mb-4">
              "If you don't like it, you can't have it."
            </p>
            <p className="text-gray-600 text-lg">
              If the car isn't as described when you arrive for pickup, the deal is off. No questions asked. No pressure. No games. That's our promise.
            </p>
          </div>
        </div>
      </section>

      {/* Current Auction & Inventory */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          {currentEvent && (
            <div className="bg-deep-blue text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                    Current Auction
                  </p>
                  <h2 className="text-2xl font-bold mt-1">{currentEvent.title}</h2>
                  <p className="text-blue-200 mt-2">
                    {new Date(currentEvent.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    -{' '}
                    {new Date(currentEvent.endDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {currentEvent.externalLink && (
                  <a
                    href={currentEvent.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-action-orange text-white px-6 py-3 rounded font-bold hover:bg-orange-600 transition-colors"
                  >
                    Join Auction
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-brand">
              {vehicles.length > 0 ? 'Available Vehicles' : 'Inventory'}
            </h2>
            <Link
              href="/results"
              className="text-deep-blue hover:text-action-orange text-sm font-medium"
            >
              View Past Results
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-deep-blue p-8 text-center">
              <h3 className="text-lg font-bold text-slate-brand mb-2">
                No Active Listings
              </h3>
              <p className="text-gray-600">
                Check back soon for our next auction event. New inventory is added regularly.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-action-orange hover:shadow-xl transition-shadow block"
                >
                  {/* Video Thumbnail */}
                  {vehicle.videoUrl ? (
                    <div className="relative aspect-video bg-gray-200">
                      <img
                        src={getVideoThumbnail(vehicle.videoUrl)}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs">No image</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-brand">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        {vehicle.trim && (
                          <p className="text-sm text-gray-500">{vehicle.trim}</p>
                        )}
                        {vehicle.mileage && (
                          <p className="text-sm text-gray-500">{Number(vehicle.mileage).toLocaleString()} miles</p>
                        )}
                      </div>
                      {vehicle.price && (
                        <p className="text-lg font-bold text-action-orange">
                          ${Number(vehicle.price).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 mb-4">
                      <span className="mr-1">VIN:</span>
                      <CopyVin vin={vehicle.vin} className="inline-flex" />
                    </div>

                    {vehicle.aiDisclosures && (
                      <div className="bg-gray-50 rounded p-3 mb-4">
                        <p className="text-xs text-gray-600 line-clamp-3">
                          {vehicle.aiDisclosures}
                        </p>
                      </div>
                    )}

                    {vehicle.saleEvent?.externalLink && (
                      <a
                        href={vehicle.saleEvent.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="block w-full bg-action-orange text-white text-center py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                      >
                        Bid Now
                      </a>
                    )}
                  </div>

                  {vehicle.saleEvent && (
                    <div className="bg-gray-50 px-6 py-3 border-t">
                      <p className="text-xs text-gray-500">
                        {vehicle.saleEvent.title}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-brand text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Deal Machine</h3>
              <p className="text-gray-400 text-sm">
                50 years of wholesale excellence. Direct from finance companies and new car trades to you.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Our Promise</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>Full Transparency</li>
                <li>The $800 Rule Protection</li>
                <li>No Questions Asked Returns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <Link href="/results" className="hover:text-white transition-colors">
                    Auction Results
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Deal Machine Public Auctions. Powered by i Finance.
          </div>
        </div>
      </footer>
    </div>
  )
}
