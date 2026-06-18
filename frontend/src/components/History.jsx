import { useState } from 'react'

export default function History({ logs, onDelete, onDeleteAll }) {
  const [showConfirm, setShowConfirm] = useState(false)

  // Group logs by date
  const grouped = {}
  logs.forEach(log => {
    if (!log.timestamp) return
    const date = log.timestamp.split('T')[0]
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(log)
  })

  // Sort dates newest first
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) return 'Today'
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'

    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl block mb-4">📭</span>
        <p className="text-slate-400 text-lg font-medium">No records yet</p>
        <p className="text-slate-600 text-sm mt-1">Start logging to see your history here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header with Delete All Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 px-1">Daily Records</h2>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs font-semibold text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all hover:bg-red-500/10"
        >
          🗑️ Delete All
        </button>
      </div>

      {/* Delete All Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6 max-w-xs w-full mx-4 shadow-2xl animate-scaleIn space-y-4">
            <div className="text-center">
              <span className="text-4xl block mb-2">⚠️</span>
              <p className="text-white font-bold text-lg">Delete All History?</p>
              <p className="text-slate-400 text-sm mt-2">This will permanently remove all {logs.length} logs. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAll()
                  setShowConfirm(false)
                }}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-semibold py-3 rounded-2xl transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Groups */}
      {sortedDates.map(date => {
        const dayLogs = grouped[date]
        const daySpent = dayLogs.reduce((sum, log) => sum + (log.custom_price || (log.average_price_per_pack / log.units_per_pack)), 0)
        const dayNicotine = dayLogs.reduce((sum, log) => sum + log.nicotine_mg_per_unit, 0)
        const dayCount = dayLogs.length

        return (
          <div key={date} className="bg-slate-800/40 rounded-3xl border border-slate-700/30 overflow-hidden">
            {/* Day Header */}
            <div className="px-5 py-4 border-b border-slate-700/30 flex items-center justify-between bg-slate-800/60">
              <div>
                <p className="text-white font-bold">{formatDate(date)}</p>
                <p className="text-slate-500 text-xs">{date}</p>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Items</p>
                  <p className="text-emerald-400 font-bold">{dayCount}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Spent</p>
                  <p className="text-red-400 font-bold">₹{daySpent.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Nic</p>
                  <p className="text-amber-400 font-bold">{dayNicotine.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Day's Log Items */}
            <div className="divide-y divide-slate-700/20">
              {dayLogs.map((log, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-700/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {log.category === 'bidi' ? '🟤' : log.category === 'smokeless_tobacco' ? '🟡' : log.category === 'disposable_vape' ? '💨' : '🚬'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-300">{log.name}</p>
                      <p className="text-[11px] text-slate-600">
                        {new Date(log.timestamp).toLocaleTimeString()} · {log.nicotine_mg_per_unit}mg nic
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400/80 font-semibold text-sm">
                      ₹{(log.custom_price || (log.average_price_per_pack / log.units_per_pack)).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDelete(log.timestamp)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all text-xs p-1 rounded-lg hover:bg-red-500/10"
                      title="Delete this log"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
