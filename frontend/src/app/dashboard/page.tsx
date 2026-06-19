'use client'

import { useState } from 'react'

const CITY_METRICS = {
  Jaipur: {
    temp: "38.2°C",
    severity: "8.2/10",
    green: "14.5%",
    concrete: "64.8%",
    pop: "6,500 / km²",
    trend: [34, 35, 37, 38, 39, 38, 38],
    causes: "Desert margin heat advection & building congestion",
    status: "Critical Alert"
  },
  Delhi: {
    temp: "41.5°C",
    severity: "9.5/10",
    green: "11.2%",
    concrete: "72.4%",
    pop: "11,200 / km²",
    trend: [38, 39, 41, 42, 43, 41, 41],
    causes: "High building density & vehicular heat trapping",
    status: "Severe Emergency"
  },
  "New York": {
    temp: "31.4°C",
    severity: "5.8/10",
    green: "22.8%",
    concrete: "52.1%",
    pop: "10,400 / km²",
    trend: [28, 29, 31, 31, 32, 30, 31],
    causes: "Rooftop solar trapping & dense paving heat sink",
    status: "Moderate Alert"
  },
  Tokyo: {
    temp: "33.8°C",
    severity: "6.9/10",
    green: "18.3%",
    concrete: "59.2%",
    pop: "15,200 / km²",
    trend: [30, 31, 33, 34, 35, 33, 34],
    causes: "Core concrete heat sink & lack of open wind corridors",
    status: "Elevated Alert"
  }
}

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof CITY_METRICS>('Jaipur')
  const metrics = CITY_METRICS[selectedCity]

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Urban Heat Monitor</h1>
          <p className="text-sm text-gray-400">Real-time localized climate risk analytics</p>
        </div>
        
        {/* City Switcher */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {(Object.keys(CITY_METRICS) as Array<keyof typeof CITY_METRICS>).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedCity === city
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Hotspot Temp</div>
          <div className="text-3xl font-display font-extrabold text-white mt-2 glow-text">{metrics.temp}</div>
          <div className="text-[10px] text-primary mt-1">{metrics.status}</div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Severity Index</div>
          <div className="text-3xl font-display font-extrabold text-white mt-2">{metrics.severity}</div>
          <div className="text-[10px] text-gray-500 mt-1">Scale: 1 - 10</div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Green Cover %</div>
          <div className="text-3xl font-display font-extrabold text-white mt-2">{metrics.green}</div>
          <div className="text-[10px] text-green-400 mt-1">Recommended: &gt; 25%</div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Concrete Surface</div>
          <div className="text-3xl font-display font-extrabold text-white mt-2">{metrics.concrete}</div>
          <div className="text-[10px] text-gray-500 mt-1">Impermeable land fraction</div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="text-xs text-gray-400 uppercase tracking-wider">Population Density</div>
          <div className="text-3xl font-display font-extrabold text-white mt-2">{metrics.pop}</div>
          <div className="text-[10px] text-gray-500 mt-1">Per square kilometer</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-white">7-Day Local Forecast</h3>
            <p className="text-xs text-gray-400">Prophet model inference output</p>
          </div>
          
          {/* Beautiful SVG Sparkline */}
          <div className="w-full h-64 bg-black/20 rounded-xl relative border border-white/5 flex items-end px-4 pb-6">
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5e3a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff5e3a" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="700" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="700" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />

              {/* Area path */}
              <path
                d={`M 50,${200 - (metrics.trend[0] - 20) * 8} 
                    L 150,${200 - (metrics.trend[1] - 20) * 8} 
                    L 250,${200 - (metrics.trend[2] - 20) * 8} 
                    L 350,${200 - (metrics.trend[3] - 20) * 8} 
                    L 450,${200 - (metrics.trend[4] - 20) * 8} 
                    L 550,${200 - (metrics.trend[5] - 20) * 8} 
                    L 650,${200 - (metrics.trend[6] - 20) * 8} 
                    L 650,200 L 50,200 Z`}
                fill="url(#chartGrad)"
              />
              
              {/* Line path */}
              <path
                d={`M 50,${200 - (metrics.trend[0] - 20) * 8} 
                    L 150,${200 - (metrics.trend[1] - 20) * 8} 
                    L 250,${200 - (metrics.trend[2] - 20) * 8} 
                    L 350,${200 - (metrics.trend[3] - 20) * 8} 
                    L 450,${200 - (metrics.trend[4] - 20) * 8} 
                    L 550,${200 - (metrics.trend[5] - 20) * 8} 
                    L 650,${200 - (metrics.trend[6] - 20) * 8}`}
                fill="none"
                stroke="#ff5e3a"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Data Dots and Labels */}
              {metrics.trend.map((val, idx) => (
                <g key={idx}>
                  <circle
                    cx={50 + idx * 100}
                    cy={200 - (val - 20) * 8}
                    r="5"
                    fill="#ffffff"
                    stroke="#ff5e3a"
                    strokeWidth="2"
                  />
                  <text
                    x={50 + idx * 100}
                    y={180 - (val - 20) * 8}
                    fill="#ffffff"
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {val}°C
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Local Analysis Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Environmental Profile</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs text-primary font-bold uppercase tracking-wider">Overheating Drivers:</span>
              <p className="text-sm text-gray-300 leading-relaxed font-light">{metrics.causes}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
              <span className="text-gray-400">AQI Rating:</span>
              <span className="font-semibold text-white">142 (Moderate)</span>
            </div>
            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
              <span className="text-gray-400">Wind Velocity:</span>
              <span className="font-semibold text-white">12.5 km/h</span>
            </div>
            <div className="flex justify-between text-xs pb-1">
              <span className="text-gray-400">Average Humidity:</span>
              <span className="font-semibold text-white">45%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
