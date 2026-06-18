import { useState, useEffect } from 'react'

export default function Dashboard({ stats }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  )

  const { today, weeklyData, weekTotal, allTime, smokeFreeStreak, lastLog } = stats

  const timeSinceLast = lastLog ? getTimeSince(lastLog.timestamp, now) : null

  function getTimeSince(timestamp, currentTime) {
    const diff = currentTime - new Date(timestamp).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    const days = Math.floor(hrs / 24)
    if (days > 0) return `${days}d ${hrs % 24}h ago`
    if (hrs > 0) return `${hrs}h ${mins % 60}m ago`
    return `${mins}m ago`
  }

  const getStatus = (count) => {
    if (count === 0) return { gradient: 'from-emerald-500/20 to-teal-500/10', accent: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Clean Day', sub: 'No consumption logged today', dot: 'bg-emerald-400' }
    if (count <= 3) return { gradient: 'from-yellow-500/15 to-amber-500/10', accent: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Moderate', sub: `${count} items logged`, dot: 'bg-yellow-400' }
    if (count <= 7) return { gradient: 'from-orange-500/15 to-red-500/10', accent: 'text-orange-400', border: 'border-orange-500/20', label: 'High Usage', sub: `${count} items — consider cutting down`, dot: 'bg-orange-400' }
    return { gradient: 'from-red-500/20 to-rose-600/10', accent: 'text-red-400', border: 'border-red-500/20', label: 'Critical', sub: `${count} items — your body needs a break`, dot: 'bg-red-400' }
  }

  const status = getStatus(today.count)
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="space-y-4 pb-2">

      {/* Status Card */}
      <div className={`rounded-2xl bg-gradient-to-br ${status.gradient} border ${status.border} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status.dot} shadow-lg`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Today's Status</span>
          </div>
          {timeSinceLast && (
            <span className="text-[10px] text-slate-600 bg-slate-800/60 px-2 py-1 rounded-lg">{timeSinceLast}</span>
          )}
        </div>
        <p className={`text-2xl font-black ${status.accent}`}>{status.label}</p>
        <p className="text-slate-500 text-sm mt-0.5">{status.sub}</p>
      </div>

      {/* Streak */}
      {smokeFreeStreak > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/40 p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Smoke-Free Streak</p>
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {smokeFreeStreak} <span className="text-lg">{smokeFreeStreak === 1 ? 'day' : 'days'}</span>
            </p>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
      )}

      {/* Today Stats Grid */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">Today</p>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard label="Items Logged" value={today.count} accent="text-emerald-400" bg="from-emerald-500/10 to-emerald-500/5" icon="🚬" />
          <StatCard label="Money Spent" value={`₹${today.spent.toFixed(0)}`} accent="text-red-400" bg="from-red-500/10 to-red-500/5" icon="💸" />
          <StatCard label="Nicotine" value={`${today.nicotine.toFixed(1)}mg`} accent="text-amber-400" bg="from-amber-500/10 to-amber-500/5" icon="⚡" />
          <StatCard label="Tar Inhaled" value={`${today.tar.toFixed(1)}mg`} accent="text-purple-400" bg="from-purple-500/10 to-purple-500/5" icon="☁️" />
        </div>
      </div>

      {/* Weekly Chart */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">This Week</p>
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 p-4">
          <div className="flex items-end gap-1.5 h-28 mb-2">
            {weeklyData.map((day, i) => {
              const height = day.count > 0 ? Math.max(10, (day.count / maxCount) * 100) : 6
              const isToday = i === weeklyData.length - 1
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                  {day.count > 0 && (
                    <span className="text-[9px] text-slate-400 font-bold">{day.count}</span>
                  )}
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        day.count === 0
                          ? 'bg-slate-700/40'
                          : isToday
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                          : 'bg-gradient-to-t from-slate-600 to-slate-500'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-[9px] font-bold uppercase ${isToday ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {days[new Date(day.date).getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-slate-700/40 pt-3 grid grid-cols-3 gap-2 text-center">
            <WeekStat label="Items" value={weekTotal.count} color="text-slate-300" />
            <WeekStat label="Spent" value={`₹${weekTotal.spent.toFixed(0)}`} color="text-red-400" />
            <WeekStat label="Nicotine" value={`${weekTotal.nicotine.toFixed(0)}mg`} color="text-amber-400" />
          </div>
        </div>
      </div>

      {/* All Time */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-0.5">All Time</p>
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 divide-y divide-slate-700/40">
          <StatRow label="Total Items Logged" value={allTime.count} color="text-slate-300" />
          <StatRow label="Money Spent" value={`₹${allTime.spent.toFixed(0)}`} color="text-red-400" />
          <StatRow label="Nicotine Consumed" value={`${allTime.nicotine.toFixed(1)} mg`} color="text-amber-400" />
          <StatRow label="Tar Inhaled" value={`${allTime.tar.toFixed(1)} mg`} color="text-purple-400" />
        </div>
      </div>

    </div>
  )
}

function StatCard({ label, value, accent, bg, icon }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${bg} border border-slate-700/30 p-4`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{icon}</span>
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      </div>
      <p className={`text-2xl font-black ${accent}`}>{value}</p>
    </div>
  )
}

function WeekStat({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">{label}</p>
      <p className={`font-bold text-sm ${color}`}>{value}</p>
    </div>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`${color} font-bold text-sm`}>{value}</span>
    </div>
  )
}