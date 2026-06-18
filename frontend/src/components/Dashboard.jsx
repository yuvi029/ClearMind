import { useState, useEffect } from 'react'

export default function Dashboard({ stats }) {
  const [now, setNow] = useState(Date.now())

  // Update the "time since last" every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return null

  const { today, weeklyData, weekTotal, allTime, smokeFreeStreak, lastLog } = stats

  // Time since last log
  const timeSinceLast = lastLog ? getTimeSince(lastLog.timestamp, now) : null

  function getTimeSince(timestamp, currentTime) {
    const diff = currentTime - new Date(timestamp).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    const days = Math.floor(hrs / 24)
    if (days > 0) return `${days}d ${hrs % 24}h`
    if (hrs > 0) return `${hrs}h ${mins % 60}m`
    return `${mins}m`
  }

  // Health warning level
  const getWarning = (count) => {
    if (count === 0) return { color: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', label: '✨ Clean Day!', sub: 'No consumption logged today' }
    if (count <= 3) return { color: 'from-yellow-500 to-amber-500', text: 'text-yellow-400', label: '⚡ Moderate', sub: `${count} items logged` }
    if (count <= 7) return { color: 'from-orange-500 to-red-500', text: 'text-orange-400', label: '⚠️ High', sub: `${count} items — consider cutting down` }
    return { color: 'from-red-500 to-rose-600', text: 'text-red-400', label: '🔴 Critical', sub: `${count} items — your body needs a break` }
  }
  const warning = getWarning(today.count)

  // Max value for the weekly chart bar heights
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1)

  return (
    <div className="space-y-6 stagger-children">

      {/* Status Banner */}
      <div className="glass-card rounded-3xl p-5 text-center animate-fadeInUp overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${warning.color} opacity-[0.06]`}></div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Today's Status</p>
          <p className={`text-2xl font-black ${warning.text}`}>{warning.label}</p>
          <p className="text-slate-500 text-xs mt-1">{warning.sub}</p>
          {timeSinceLast && (
            <p className="text-slate-600 text-[11px] mt-2">Last logged: {timeSinceLast} ago</p>
          )}
        </div>
      </div>

      {/* Smoke-Free Streak */}
      {smokeFreeStreak > 0 && (
        <div className="gradient-border glass-card rounded-3xl p-5 text-center animate-fadeInUp">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">🔥 Smoke-Free Streak</p>
          <p className="text-4xl font-black gradient-text">{smokeFreeStreak}</p>
          <p className="text-slate-500 text-sm font-medium">{smokeFreeStreak === 1 ? 'day' : 'days'}</p>
        </div>
      )}

      {/* Today's Stats Grid */}
      <div className="animate-fadeInUp">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">Today</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Items" value={today.count} color="text-emerald-400" icon="🚬" />
          <StatCard label="Spent" value={`₹${today.spent.toFixed(0)}`} color="text-red-400" icon="💸" />
          <StatCard label="Nicotine" value={`${today.nicotine.toFixed(1)}mg`} color="text-amber-400" icon="⚡" />
          <StatCard label="Tar" value={`${today.tar.toFixed(1)}mg`} color="text-purple-400" icon="☁️" />
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="animate-fadeInUp">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">This Week</h2>
        <div className="glass-card rounded-3xl p-5">
          <div className="flex items-end justify-between gap-2 h-32 mb-3">
            {weeklyData.map((day, i) => {
              const height = day.count > 0 ? Math.max(8, (day.count / maxCount) * 100) : 4
              const isToday = i === weeklyData.length - 1
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold">{day.count || ''}</span>
                  <div
                    className={`w-full rounded-xl transition-all duration-700 animate-progress ${
                      day.count === 0
                        ? 'bg-slate-800'
                        : isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-gradient-to-t from-slate-700 to-slate-600'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className={`text-[9px] font-bold uppercase ${isToday ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day.date).getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-slate-700/30 pt-3 flex justify-around text-center">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Items</p>
              <p className="text-white font-bold">{weekTotal.count}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Spent</p>
              <p className="text-red-400 font-bold">₹{weekTotal.spent.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Nicotine</p>
              <p className="text-amber-400 font-bold">{weekTotal.nicotine.toFixed(0)}mg</p>
            </div>
          </div>
        </div>
      </div>

      {/* All-Time Stats */}
      <div className="animate-fadeInUp">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 px-1">All Time</h2>
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <StatRow label="Total Items Logged" value={allTime.count} />
          <div className="h-px bg-slate-800"></div>
          <StatRow label="Total Money Spent" value={`₹${allTime.spent.toFixed(0)}`} color="text-red-400" />
          <div className="h-px bg-slate-800"></div>
          <StatRow label="Total Nicotine Consumed" value={`${allTime.nicotine.toFixed(1)} mg`} color="text-amber-400" />
          <div className="h-px bg-slate-800"></div>
          <StatRow label="Total Tar Inhaled" value={`${allTime.tar.toFixed(1)} mg`} color="text-purple-400" />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="glass-card p-4 rounded-2xl hover:scale-[1.02] transition-transform duration-300 group">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm group-hover:scale-110 transition-transform">{icon}</span>
        <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">{label}</p>
      </div>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
    </div>
  )
}

function StatRow({ label, value, color = 'text-white' }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`${color} font-bold`}>{value}</span>
    </div>
  )
}
