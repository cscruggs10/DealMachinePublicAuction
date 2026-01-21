import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Deal Machine [Public Auctions]',
  description: 'Wholesale inventory direct from Finance Companies and New Car Trades.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <header className="bg-slate-brand border-b-4 border-action-orange">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              DEAL MACHINE{' '}
              <span className="text-action-orange">[Public Auctions]</span>
            </h1>
            <p className="text-slate-300 mt-1 text-sm md:text-base">
              Wholesale inventory direct from Finance Companies and New Car Trades.
            </p>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-slate-brand text-slate-400 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm">
            <p>Powered by i Finance</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
