import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getSoldVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      status: 'SOLD',
    },
    include: {
      saleEvent: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return vehicles
}

export default async function ResultsPage() {
  const vehicles = await getSoldVehicles()

  const totalSales = vehicles.reduce((acc, v) => {
    return acc + (v.finalSalePrice ? Number(v.finalSalePrice) : 0)
  }, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-brand">Auction Results</h1>
          <p className="text-gray-600 mt-1">
            View past sale results and final prices
          </p>
        </div>
        <Link
          href="/"
          className="text-deep-blue hover:text-action-orange text-sm font-medium"
        >
          Back to Current Auction
        </Link>
      </div>

      {vehicles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Vehicles Sold</p>
            <p className="text-2xl font-bold text-slate-brand">{vehicles.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Total Sales Volume</p>
            <p className="text-2xl font-bold text-action-orange">
              ${totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Average Sale Price</p>
            <p className="text-2xl font-bold text-deep-blue">
              ${Math.round(totalSales / vehicles.length).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Events</p>
            <p className="text-2xl font-bold text-slate-brand">
              {new Set(vehicles.map((v) => v.saleEventId).filter(Boolean)).size}
            </p>
          </div>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-deep-blue p-8 text-center">
          <h3 className="text-lg font-bold text-slate-brand mb-2">
            No Results Yet
          </h3>
          <p className="text-gray-600">
            Check back after our first auction concludes to see sale results.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-brand text-white">
                <th className="text-left p-4 font-semibold">Vehicle</th>
                <th className="text-left p-4 font-semibold">VIN</th>
                <th className="text-left p-4 font-semibold">Event</th>
                <th className="text-right p-4 font-semibold">Sale Price</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => (
                <tr
                  key={vehicle.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-4">
                    <Link href={`/vehicles/${vehicle.id}`} className="block">
                      <p className="font-medium text-slate-brand hover:text-deep-blue">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      {vehicle.trim && (
                        <p className="text-sm text-gray-500">{vehicle.trim}</p>
                      )}
                    </Link>
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-500">
                    {vehicle.vin}
                  </td>
                  <td className="p-4 text-sm">
                    {vehicle.saleEvent?.title || (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {vehicle.finalSalePrice ? (
                      <span className="text-lg font-bold text-action-orange">
                        ${Number(vehicle.finalSalePrice).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
