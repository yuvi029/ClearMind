import { useState, useEffect } from 'react'

export default function HealthPage({ user }) {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:5000/api/health/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setHealthData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user.email])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!healthData || !healthData.lastLogTime) {
    return (
      <div className="text-center py-20 animate-fadeInUp">
        <span className="text-5xl block mb-4 animate-float">🌱</span>
        <p className="text-slate-300 text-lg font-bold">No Data Yet</p>
        <p className="text-slate-600 text-sm mt-2 max-w-xs mx-auto">
          Once you log your first item, your health recovery timeline will appear here showing how your body heals over time.
        </p>
      </div>
    )
  }

  const { hoursSinceLastLog, milestones } = healthData

  // Format hours to readable string
  const formatHours = (h) => {
    if (h < 1) return `${Math.round(h * 60)} minutes`
    if (h < 24) return `${Math.round(h)} hours`
    if (h < 720) return `${Math.round(h / 24)} days`
    return `${Math.round(h / 720)} months`
  }

  return (
    <div className="space-y-6">
      {/* Time Since Last Header */}
      <div className="glass-card rounded-3xl p-6 text-center animate-fadeInUp relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5"></div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Time Since Last Consumption</p>
          <p className="text-4xl font-black gradient-text">{formatHours(hoursSinceLastLog)}</p>
          <p className="text-slate-600 text-xs mt-2">Your body is healing with every passing moment</p>
        </div>
      </div>

      {/* Health Recovery Timeline */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4 px-1">🏥 Recovery Timeline</h2>
        <div className="space-y-3">
          {milestones.map((milestone, i) => {
            const isAchieved = milestone.achieved
            const progress = Math.min(100, milestone.progress)

            return (
              <div
                key={i}
                className={`glass-card rounded-2xl p-4 transition-all duration-500 ${
                  isAchieved ? 'border-emerald-500/30' : ''
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    isAchieved
                      ? 'bg-emerald-500/20 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800'
                  }`}>
                    {isAchieved ? '✅' : milestone.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-bold ${isAchieved ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {milestone.title}
                      </p>
                      <span className="text-[10px] text-slate-600 font-medium flex-shrink-0">
                        {formatHours(milestone.hours)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{milestone.description}</p>

                    {/* Progress Bar */}
                    {!isAchieved && (
                      <div className="mt-2.5">
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 progress-shine"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-1 font-medium">{progress.toFixed(0)}% complete</p>
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
