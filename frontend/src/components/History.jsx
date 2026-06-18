import { useState } from 'react'

export default function History({ logs, onDelete, onDeleteAll }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const grouped = {}
  logs.forEach(log => {
    if (!log.timestamp) return
    const date = log.timestamp.split('T')[0]
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(log)
  })

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === today.toISOString().split('T')[0]) return 'Today'
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const getCategoryIcon = (category) => {
    if (category === 'bidi') return '🟤'
    if (category === 'smokeless_tobacco') return '🟡'
    if (category === 'disposable_vape') return '💨'
    return '🚬'
  }

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-24">
        <span className="text-5xl block mb-4">📭</span>
        <p className="text-slate-300 text-lg font-bold">No records yet</p>
        <p className="text-slate-600 text-sm mt-1">Start logging to see your history here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-2">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-400">{logs.length} total entries</p>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs font-semibold text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all hover:bg-red-500/10"
        >
          Clear All
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 max-w-xs w-full mx-4 shadow-2xl space-y-4">
            <div className="text-center">
              <span className="text-4xl block mb-3">⚠️</span>
              <p className="text-white font-bold text-lg">Delete All History?</p>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                This will permanently remove all {logs.length} logs. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDeleteAll(); setShowConfirm(false) }}
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

        return (
          <div key={date} className="rounded-2xl bg-slate-800/50 border border-slate-700/40 overflow-hidden">
            {/* Day Header */}
            <div className="px-4 py-3 bg-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{formatDate(date)}</p>
                <p className="text-[10px] text-slate-600">{date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Pill label="×" value={dayLogs.length} color="text-emerald-400" />
                <Pill label="₹" value={daySpent.toFixed(0)} color="text-red-400" />
                <Pill label="" value={`${dayNicotine.toFixed(1)}mg`} color="text-amber-400" />
              </div>
            </div>

            {/* Log Items */}
            <div className="divide-y divide-slate-700/30">
              {dayLogs.map((log, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between group hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{getCategoryIcon(log.category)}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{log.name}</p>
                      <p className="text-[10px] text-slate-600">
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        {' · '}{log.nicotine_mg_per_unit}mg nicotine
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-red-400/80">
                      ₹{(log.custom_price || (log.average_price_per_pack / log.units_per_pack)).toFixed(0)}
                    </span>
                    <button
                      onClick={() => onDelete(log.timestamp)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs"
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

function Pill({ label, value, color }) {
  return (
    <div className="text-center">
      <p className={`text-xs font-bold ${color}`}>{label}{value}</p>
    </div>
  )
}