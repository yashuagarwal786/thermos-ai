'use client'

import { useState } from 'react'

export default function SatellitePage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const executeUpload = async () => {
    if (!file) return
    setIsUploading(true)

    // Simulate API request to backend satellite-service /upload
    setTimeout(() => {
      setIsUploading(false)
      setUploadResult({
        id: "d9e8c7b6-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
        filename: file.name,
        width: 1024,
        height: 1024,
        bounds: {
          left: 75.75,
          bottom: 26.85,
          right: 75.90,
          top: 26.98
        },
        temperature_metrics: {
          min: 24.5,
          max: 42.8,
          mean: 34.6
        },
        hotspot_percentage: 28.5,
        severity_score: 7.2
      })
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Raster Processing Engine</h1>
        <p className="text-sm text-gray-400">Upload Landsat, Sentinel, or MODIS thermal band GeoTIFF files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="font-display font-bold text-lg text-white">Upload Console</h3>
          
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors">
            <span className="text-4xl">🛰️</span>
            <div className="space-y-1">
              <p className="text-sm text-white font-medium">Select TIFF raster file</p>
              <p className="text-xs text-gray-500">Supports .tif, .tiff, .png, .jpg</p>
            </div>
            
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="raster-file-input"
              accept=".tif,.tiff,.png,.jpg,.jpeg"
            />
            <label
              htmlFor="raster-file-input"
              className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
            >
              Browse Files
            </label>
          </div>

          {file && (
            <div className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center text-xs">
              <span className="truncate max-w-[200px] text-gray-300 font-mono">{file.name}</span>
              <span className="text-gray-500 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          )}

          <button
            onClick={executeUpload}
            disabled={!file || isUploading}
            className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all ${
              !file || isUploading
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover shadow-primary/20 hover:scale-[1.01]'
            }`}
          >
            {isUploading ? 'Analyzing Image...' : 'Process Image'}
          </button>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-center min-h-[400px]">
          {uploadResult ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="font-display font-bold text-lg text-white">Analysis Diagnostics</h3>
                <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-mono font-bold uppercase">
                  Processed
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Max LST</span>
                  <p className="text-xl font-bold text-white mt-1">{uploadResult.temperature_metrics.max}°C</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Mean LST</span>
                  <p className="text-xl font-bold text-white mt-1">{uploadResult.temperature_metrics.mean}°C</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Hotspot Ratio</span>
                  <p className="text-xl font-bold text-white mt-1">{uploadResult.hotspot_percentage}%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Risk Rating</span>
                  <p className="text-xl font-bold text-white mt-1 text-primary">{uploadResult.severity_score}/10</p>
                </div>
              </div>

              {/* Spatial Extents */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Spatial Boundary Extents</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/25 p-3 rounded-lg border border-white/5 text-gray-400">
                  <div>West: {uploadResult.bounds.left}</div>
                  <div>East: {uploadResult.bounds.right}</div>
                  <div>North: {uploadResult.bounds.top}</div>
                  <div>South: {uploadResult.bounds.bottom}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 space-y-2 py-10">
              <span className="text-5xl block opacity-30">📊</span>
              <p className="text-sm">No active raster analysis results loaded.</p>
              <p className="text-xs text-gray-600">Upload and process a file using the console.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
