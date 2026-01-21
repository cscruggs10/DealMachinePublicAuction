import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-deep-blue p-8">
        <h2 className="text-2xl font-bold text-slate-brand mb-4">
          Welcome to Deal Machine
        </h2>
        <p className="text-gray-600 mb-6">
          Your trusted source for wholesale vehicle auctions. Browse our current
          inventory of finance company returns and new car dealer trades.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-deep-blue mb-2">
              Upcoming Auctions
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              View our scheduled sale events and mark your calendar.
            </p>
            <span className="text-action-orange font-semibold text-sm">
              Coming Soon
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-deep-blue mb-2">
              Current Inventory
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Browse vehicles available for purchase.
            </p>
            <span className="text-action-orange font-semibold text-sm">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/admin"
          className="text-deep-blue hover:text-action-orange transition-colors text-sm"
        >
          Admin Dashboard
        </Link>
      </div>
    </div>
  )
}
