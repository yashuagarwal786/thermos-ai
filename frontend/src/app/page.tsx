import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-primary font-medium tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Co-designed with NASA & ISRO Climate datasets
        </div>
        
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-white">
          Urban Heat Intelligence <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-amber-300 glow-text">
            For Climate Cooling
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 font-light leading-relaxed">
          Thermos AI maps localized Urban Heat Islands from multi-spectral satellite imagery, forecasts warming curves, and models simulated canopy micro-mitigation scenarios.
        </p>

        <div className="pt-6 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard" className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-primary rounded-lg hover:bg-primary-hover shadow-xl shadow-primary/30 transition-all hover:scale-105">
            Launch Analytics Monitor
          </Link>
          <Link href="/chat" className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-gray-300 border border-white/10 rounded-lg hover:border-white/25 hover:text-white transition-all bg-white/5 backdrop-blur-sm">
            Consult AI Expert
          </Link>
        </div>
      </div>

      {/* Grid Feature Highlights */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-24">
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">🛰️</div>
            <h3 className="font-display font-bold text-xl text-white">Satellite Parsing</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Extracts Land Surface Temperature (LST) patterns from Landsat 8, Sentinel, and MODIS rasters using bilateral noise filtering.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-xl font-bold">📈</div>
            <h3 className="font-display font-bold text-xl text-white">Multi-Model Forecast</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Predicts future heat trajectories for 7 days, 30 days, or 1 year by benchmarking Prophet against XGBoost regressor pipelines.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-xl font-bold">⚙️</div>
            <h3 className="font-display font-bold text-xl text-white">Cooling Simulation</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Model land-use modifications. Simulate how adding 15% green canopy or using high-albedo paint drops urban ambient heat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
