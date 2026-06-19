import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Thermos AI | Urban Heat Intelligence Platform',
  description: 'AI-powered mapping, forecasting, and environmental recommendations for urban cooling and climate mitigation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col justify-between">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">T</div>
            <Link href="/" className="font-display font-extrabold text-xl tracking-tight text-white">
              THERMOS<span className="text-primary font-medium">.AI</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Monitor</Link>
            <Link href="/satellite" className="hover:text-primary transition-colors">Raster Scan</Link>
            <Link href="/simulation" className="hover:text-primary transition-colors">Simulation</Link>
            <Link href="/chat" className="hover:text-primary transition-colors">AI Assistant</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-semibold hover:text-white transition-colors text-gray-300">Login</Link>
            <Link href="/dashboard" className="hidden sm:inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-primary rounded hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all">Launch App</Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full glass-panel py-8 px-6 md:px-12 border-t border-white/5 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} Thermos AI. Joint Urban Heat Initiative. Supported by NASA Earth Data & Copernicus.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">APIs</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Documentation</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
