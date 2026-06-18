import { useState } from 'react'

export default function LogPage({ products, onLog }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '')
  const [customPrice, setCustomPrice] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get the currently selected product details
  const selected = products.find(p => p.id === selectedProduct)
  const unitPrice = selected ? (selected.average_price_per_pack / selected.units_per_pack) : 0

  const handleSubmit = () => {
    if (!selected) return

    for (let i = 0; i < quantity; i++) {
      const newLog = {
        ...selected,
        custom_price: customPrice ? parseFloat(customPrice) : null,
        timestamp: new Date().toISOString()
      }
      onLog(newLog)
    }

    // Show success animation
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 1500)

    // Reset form
    setCustomPrice('')
    setQuantity(1)
  }

  // Group products by category for better display
  const categories = {
    'cigarette': { label: '🚬 Cigarettes', items: [] },
    'bidi': { label: '🟤 Bidis', items: [] },
    'smokeless_tobacco': { label: '🟡 Smokeless / Pan Masala', items: [] },
    'disposable_vape': { label: '💨 Vapes', items: [] },
    'nicotine_pouch': { label: '📦 Nicotine Pouches', items: [] },
    'nrt': { label: '💊 NRT', items: [] },
  }

  filteredProducts.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].items.push(p)
    }
  })

  return (
    <div className="space-y-6 relative">

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-800 border border-emerald-500/50 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-500/20 animate-scaleIn">
            <span className="text-5xl block mb-3">✅</span>
            <p className="text-emerald-400 font-bold text-xl">Logged!</p>
            <p className="text-slate-400 text-sm mt-1">{quantity}x {selected?.name}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">Search Product</h2>
        <input
          type="text"
          placeholder="🔍  Search cigarettes, bidis, vapes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Product Selector */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">Select Product</h2>
        <div className="max-h-64 overflow-y-auto space-y-1 bg-slate-800/40 rounded-2xl border border-slate-700/30 p-2 scrollbar-thin">
          {Object.values(categories).map(cat => {
            if (cat.items.length === 0) return null
            return (
              <div key={cat.label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 py-2">{cat.label}</p>
                {cat.items.map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex justify-between items-center transition-all duration-200 ${
                      selectedProduct === product.id
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'hover:bg-slate-700/50 text-slate-300 border border-transparent'
                    }`}
                  >
                    <span className="font-medium text-sm">{product.name}</span>
                    <span className="text-xs text-slate-500">₹{(product.average_price_per_pack / product.units_per_pack).toFixed(2)}/ea</span>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Product Details */}
      {selected && (
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/40 p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-bold text-slate-100">{selected.name}</p>
              <p className="text-xs text-slate-500 mt-1">{selected.description}</p>
            </div>
            <span className="bg-slate-700/50 text-slate-300 text-xs font-medium px-3 py-1 rounded-full">{selected.category}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900/60 rounded-xl p-2">
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Nicotine</p>
              <p className="text-amber-400 font-bold text-sm">{selected.nicotine_mg_per_unit} mg</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2">
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Tar</p>
              <p className="text-purple-400 font-bold text-sm">{selected.tar_mg_per_unit} mg</p>
            </div>
            <div className="bg-slate-900/60 rounded-xl p-2">
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Price/ea</p>
              <p className="text-red-400 font-bold text-sm">₹{unitPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Price Input */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">Custom Price <span className="text-slate-600 normal-case font-normal">(optional)</span></h2>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
          <input
            type="number"
            placeholder={unitPrice.toFixed(2)}
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 pl-8 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
        <p className="text-[11px] text-slate-600 mt-2 px-1">Leave blank to use the default price from the database</p>
      </div>

      {/* Quantity Selector */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">Quantity</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 text-slate-300 text-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center"
          >−</button>
          <span className="text-3xl font-extrabold text-white w-16 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 text-slate-300 text-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center"
          >+</button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transform transition-all duration-300 active:scale-95 text-lg"
      >
        Log {quantity}x {selected?.name || 'Item'}
      </button>

    </div>
  )
}
