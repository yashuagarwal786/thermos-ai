'use client'

import { useState } from 'react'

export default function SimulationPage() {
  const [baseTemp, setBaseTemp] = useState(35.0)
  const [greenDelta, setGreenDelta] = useState(0)
  const [waterDelta, setWaterDelta] = useState(0)
  const [reflectiveDelta, setReflectiveDelta] = useState(0)
  const [concreteDelta, setConcreteDelta] = useState(0)

  // Physical coefficients matching backend simulator
  const greenCoeff = 0.16
  const waterCoeff = 0.25
  const reflectiveCoeff = 0.11
  const concreteCoeff = 0.08

  // Calculate cooling contributions client-side for instant reactivity
  const greenCooling = greenDelta * greenCoeff
  const waterCooling = waterDelta * waterCoeff
  const reflectiveCooling = reflectiveDelta * reflectiveCoeff
  const concreteCooling = concreteDelta * concreteCoeff

  const netCooling = greenCooling + waterCooling + reflectiveCooling + concreteCooling
  const simulatedTemp = baseTemp - netCooling

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Mitigation Simulator</h1>
        <p className="text-sm text-gray-400">Interactively adjust urban variables to model temperature reductions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-8">
          <h3 className="font-display font-bold text-lg text-white">Adjust Parameters</h3>

          {/* Baseline Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>Baseline Temperature</span>
              <span className="text-primary">{baseTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="28"
              max="45"
              step="0.5"
              value={baseTemp}
              onChange={(e) => setBaseTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="border-t border-white/5 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Green Cover Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Green Canopy Increase</span>
                <span className="text-white">+{greenDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={greenDelta}
                onChange={(e) => setGreenDelta(parseInt(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Water Bodies Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Hydrological Retention</span>
                <span className="text-white">+{waterDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={waterDelta}
                onChange={(e) => setWaterDelta(parseInt(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Reflective Surfaces Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Albedo Reflective Surfaces</span>
                <span className="text-white">+{reflectiveDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={reflectiveDelta}
                onChange={(e) => setReflectiveDelta(parseInt(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Concrete Reduction Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Pavement Reduction</span>
                <span className="text-white">-{concreteDelta}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={concreteDelta}
                onChange={(e) => setConcreteDelta(parseInt(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="text-center space-y-4 py-6">
            <h3 className="font-display font-bold text-lg text-white">Simulated Output</h3>
            <div className="text-6xl font-display font-extrabold text-white glow-blue-text">
              {simulatedTemp.toFixed(2)}°C
            </div>
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">
              Net Cooling Offset: -{netCooling.toFixed(2)}°C
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 border-t border-white/5 pt-6">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Vegetation Shade:</span>
              <span className="font-semibold text-emerald-400">-{greenCooling.toFixed(2)}°C</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Evaporative Water:</span>
              <span className="font-semibold text-blue-400">-{waterCooling.toFixed(2)}°C</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Albedo Reflective:</span>
              <span className="font-semibold text-cyan-400">-{reflectiveCooling.toFixed(2)}°C</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Permeable Aggregates:</span>
              <span className="font-semibold text-orange-400">-{concreteCooling.toFixed(2)}°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
