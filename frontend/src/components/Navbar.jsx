const navItems = [
  { id: 'dashboard', label: 'Home', icon: '📊' },
  { id: 'log', label: 'Log', icon: '➕' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Navbar({ currentPage, onNavigate, user, onLogout }) {
  return (
    <>
      {/* Top Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a]/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm shadow-lg shadow-emerald-500/20">
              🧠
            </div>
            <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              ClearMind
            </span>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-300 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-600 leading-tight truncate max-w-[100px]">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border-t border-slate-800/60">
        <div className="max-w-lg mx-auto px-2 py-1 flex items-center justify-around">
          {navItems.map(item => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                  isActive ? 'text-emerald-400' : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}