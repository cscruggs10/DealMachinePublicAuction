import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      {currentEvent && (
        <div className="bg-deep-blue text-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
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
        <h2 className="text-xl font-bold text-slate-brand">
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
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-brand">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    {vehicle.trim && (
                      <p className="text-sm text-gray-500">{vehicle.trim}</p>
                    )}
                  </div>
                  {vehicle.price && (
                    <p className="text-lg font-bold text-action-orange">
                      Starting Bid: ${Number(vehicle.price).toLocaleString()}
                    </p>
                  )}
                </div>

                <p className="text-xs font-mono text-gray-400 mb-4">
                  VIN: {vehicle.vin}
                </p>

                {vehicle.aiDisclosures && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {vehicle.aiDisclosures}
                    </p>
                  </div>
                )}

                {vehicle.videoUrl && (
                  <span className="inline-flex items-center text-deep-blue text-sm font-medium">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    Video Available
                  </span>
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

      <div className="mt-12 text-center">
        <Link
          href="/admin"
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          Admin
        </Link>
      </div>
    </div>
  )
}
