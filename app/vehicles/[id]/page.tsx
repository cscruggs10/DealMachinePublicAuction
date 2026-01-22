import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CopyVin from '@/components/CopyVin'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function VehicleDetailPage({ params }: Props) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: { saleEvent: true },
  })

  if (!vehicle || vehicle.status === 'DRAFT') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-brand text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-sm text-gray-300 hover:text-white mb-2 inline-block">
            &larr; Back to Listings
          </Link>
          <h1 className="text-2xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim && <span className="font-normal text-gray-300"> {vehicle.trim}</span>}
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video/Media */}
          <div className="lg:col-span-2">
            {vehicle.videoUrl ? (
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  src={vehicle.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster=""
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="bg-gray-300 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No video available</p>
                </div>
              </div>
            )}

            {/* AI Disclosures */}
            {vehicle.aiDisclosures && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-slate-brand mb-3">Vehicle Condition & Disclosures</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{vehicle.aiDisclosures}</p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow p-6">
              {vehicle.status === 'SOLD' ? (
                <>
                  <p className="text-sm text-gray-500 mb-1">Sold For</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${vehicle.finalSalePrice ? Number(vehicle.finalSalePrice).toLocaleString() : 'N/A'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-1">Starting Bid</p>
                  <p className="text-3xl font-bold text-action-orange">
                    {vehicle.price ? `$${Number(vehicle.price).toLocaleString()}` : 'Contact for Price'}
                  </p>
                </>
              )}

              {vehicle.saleEvent?.externalLink && vehicle.status !== 'SOLD' && (
                <a
                  href={vehicle.saleEvent.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-action-orange text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors mt-4"
                >
                  Bid Now
                </a>
              )}

              {vehicle.saleEvent && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Sale Event</p>
                  <p className="font-semibold text-deep-blue">{vehicle.saleEvent.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(vehicle.saleEvent.startDate).toLocaleDateString()} - {new Date(vehicle.saleEvent.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-slate-brand mb-4">Vehicle Information</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Year</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Make</span>
                  <span className="font-medium">{vehicle.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Model</span>
                  <span className="font-medium">{vehicle.model}</span>
                </div>
                {vehicle.trim && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trim</span>
                    <span className="font-medium">{vehicle.trim}</span>
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mileage</span>
                    <span className="font-medium">{Number(vehicle.mileage).toLocaleString()} miles</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-gray-500 text-sm mb-2">VIN</p>
                  <div className="bg-gray-100 p-2 rounded">
                    <CopyVin vin={vehicle.vin} className="break-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vehicle.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'SOLD'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {vehicle.status === 'ACTIVE' ? 'Available' : vehicle.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-brand text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Deal Machine Public Auctions. Powered by i Finance.
        </div>
      </footer>
    </div>
  )
}
