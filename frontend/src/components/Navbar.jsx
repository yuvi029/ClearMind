const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'log', label: 'Log', icon: '➕' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'health', label: 'Health', icon: '❤️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Navbar({ currentPage, onNavigate, user, onLogout }) {
  return (
    <>
      {/* Top Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm shadow-lg shadow-emerald-500/15">
              🧠
            </div>
            <h1 className="text-xl font-extrabold gradient-text">ClearMind</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-300 font-semibold leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-600 leading-tight truncate max-w-[120px]">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all text-sm"
              title="Sign Out"
            >
              ⏻
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-800/50 pb-safe">
        <div className="max-w-lg mx-auto px-2 py-1.5 flex items-center justify-around">
          {navItems.map(item => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span className={`text-lg transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-emerald-400' : ''}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
