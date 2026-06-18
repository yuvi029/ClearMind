import { useState } from 'react'
import products from './data/products.json'

function App() {
  const [logs, setLogs] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(products[0].id)

  // This function runs every time you click the Log button
  const handleLog = () => {
    const product = products.find(p => p.id === selectedProduct)
    if (product) {
      setLogs([...logs, { ...product, timestamp: new Date().toISOString() }])
    }
  }

  // Calculate the totals from our logs
  const totalSpent = logs.reduce((sum, log) => sum + (log.average_price_per_pack / log.units_per_pack), 0)
  const totalNicotine = logs.reduce((sum, log) => sum + log.nicotine_mg_per_unit, 0)
  const totalTar = logs.reduce((sum, log) => sum + log.tar_mg_per_unit, 0)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 font-sans">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="text-center space-y-2 mt-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
            ClearMind
          </h1>
          <p className="text-slate-400 text-sm font-medium">Monitor your health and wallet</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/50 shadow-lg backdrop-blur-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Total Spent</p>
            <p className="text-3xl font-bold text-red-400">₹{totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/50 shadow-lg backdrop-blur-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Nicotine</p>
            <p className="text-3xl font-bold text-amber-400">{totalNicotine.toFixed(2)} <span className="text-lg">mg</span></p>
          </div>
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/50 shadow-lg col-span-2 flex justify-between items-center backdrop-blur-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Total Logs</p>
              <p className="text-2xl font-bold text-emerald-400">{logs.length}</p>
            </div>
            {totalTar > 0 && (
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Total Tar</p>
                <p className="text-xl font-bold text-slate-300">{totalTar.toFixed(1)} mg</p>
              </div>
            )}
          </div>
        </div>

        {/* Logging Section */}
        <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700/50 shadow-xl space-y-5">
          <h2 className="text-xl font-bold text-slate-200">Log an item</h2>
          
          <div className="relative">
            <select 
              className="w-full bg-slate-900 border border-slate-600 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none font-medium"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{(product.average_price_per_pack / product.units_per_pack).toFixed(2)}/each)
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleLog}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transform transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">+</span> Log Consumption
          </button>
        </div>

      </div>
    </div>
  )
}

export default App
