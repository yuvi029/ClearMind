import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function HealthPage({ user }) {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/health/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setHealthData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user.email])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!healthData || !healthData.lastLogTime) {
    return (
      <div className="text-center py-24">
        <span className="text-5xl block mb-4">🌱</span>
        <p className="text-slate-300 text-lg font-bold">No data yet</p>
        <p className="text-slate-600 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
          Log your first item and your health recovery timeline will appear here.
        </p>
      </div>
    )
  }

  const { hoursSinceLastLog, milestones } = healthData

  const formatHours = (h) => {
    if (h < 1) return `${Math.round(h * 60)}m`
    if (h < 24) return `${Math.round(h)}h`
    if (h < 720) return `${Math.round(h / 24)}d`
    return `${Math.round(h / 720)}mo`
  }

  const formatHoursFull = (h) => {
    if (h < 1) return `${Math.round(h * 60)} minutes`
    if (h < 24) return `${Math.round(h)} hours`
    if (h < 720) return `${Math.round(h / 24)} days`
    return `${Math.round(h / 720)} months`
  }

  return (
    <div className="space-y-4 pb-2">

      {/* Time Since Last */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-500/20 p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Time Since Last Consumption</p>
        <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {formatHoursFull(hoursSinceLastLog)}
        </p>
        <p className="text-slate-600 text-xs mt-2">Your body heals with every passing moment</p>
      </div>

      {/* Milestones */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">Recovery Timeline</p>
        <div className="space-y-2.5">
          {milestones.map((milestone, i) => {
            const isAchieved = milestone.achieved
            const progress = Math.min(100, milestone.progress)

            return (
              <div
                key={i}
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  isAchieved
                    ? 'bg-emerald-500/10 border-emerald-500/25'
                    : 'bg-slate-800/50 border-slate-700/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    isAchieved ? 'bg-emerald-500/20' : 'bg-slate-700/60'
                  }`}>
                    {isAchieved ? '✅' : milestone.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-sm font-bold ${isAchieved ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {milestone.title}
                      </p>
                      <span className="text-[10px] text-slate-600 font-medium bg-slate-800/60 px-2 py-0.5 rounded-lg flex-shrink-0">
                        {formatHours(milestone.hours)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{milestone.description}</p>

                    {!isAchieved && (
                      <div className="mt-2.5">
                        <div className="w-full h-1 bg-slate-700/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1">{progress.toFixed(0)}% there</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}