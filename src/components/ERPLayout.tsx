import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

interface SideItem {
  label: string
  to: string
  icon: string
  group: string
}

const sideItems: SideItem[] = [
  { label: 'Dashboard',   to: '/erp',             icon: '📊', group: 'Visão Geral' },
  { label: 'Pacientes',   to: '/erp/pacientes',   icon: '🦷', group: 'Gestão de Pessoas' },
  { label: 'Dentistas',   to: '/erp/dentistas',   icon: '👨‍⚕️', group: 'Gestão de Pessoas' },
  { label: 'Voluntários', to: '/erp/voluntarios', icon: '🤝', group: 'Gestão de Pessoas' },
  { label: 'Doadores',    to: '/erp/doadores',    icon: '💛', group: 'Gestão de Pessoas' },
  { label: 'Consultas',   to: '/erp/consultas',   icon: '📅', group: 'Gestão Clínica' },
  { label: 'Prontuários', to: '/erp/prontuarios', icon: '📋', group: 'Gestão Clínica' },
  { label: 'Campanhas',   to: '/erp/campanhas',   icon: '📣', group: 'Administrativo' },
  { label: 'Doações',     to: '/erp/doacoes',     icon: '💰', group: 'Administrativo' },
  { label: 'Materiais',   to: '/erp/materiais',   icon: '🧰', group: 'Administrativo' },
  { label: 'IA',          to: '/erp/ia',          icon: '🤖', group: 'IA & Análise' },
  { label: 'Relatórios',  to: '/erp/relatorios',  icon: '📈', group: 'IA & Análise' },
]

const groups = sideItems.reduce<Record<string, SideItem[]>>((acc, item) => {
  if (!acc[item.group]) acc[item.group] = []
  acc[item.group].push(item)
  return acc
}, {})

const GREEN  = '#7ab800'
const DARK   = '#2d4a1e'
const LIGHT  = '#f4f9ec'

export default function ERPLayout() {
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const Sidebar = () => (
    <aside
      className="flex flex-col h-full overflow-y-auto scrollbar-hide transition-all duration-300"
      style={{
        width: collapsed ? 64 : 224,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-100">
        <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: GREEN }}>
          <img src="/image/logo-dnn.png" alt="DNN" className="w-7 h-7 object-contain"
            style={{ mixBlendMode: 'screen' }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-sm leading-tight whitespace-nowrap"
              style={{ color: DARK }}>De Novo Não!</p>
            <p className="text-gray-400 text-xs whitespace-nowrap">ERP — Turma do Bem</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-4">
        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName}>
            {!collapsed && (
              <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-1"
                style={{ color: '#9ca3af' }}>
                {groupName}
              </p>
            )}
            {collapsed && <div className="border-t border-gray-100 my-1" />}
            <ul className="space-y-0.5">
              {items.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/erp'}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center rounded-xl transition-all duration-200 w-full"
                    style={({ isActive }) => ({
                      gap: collapsed ? 0 : 10,
                      padding: collapsed ? '8px 0' : '8px 10px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      backgroundColor: isActive ? LIGHT : 'transparent',
                      color: isActive ? DARK : '#6b7280',
                      fontWeight: isActive ? 700 : 400,
                      borderLeft: isActive ? `3px solid ${GREEN}` : '3px solid transparent',
                    })}
                  >
                    <span className="text-lg shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="text-sm font-body whitespace-nowrap">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-100 space-y-1">
        <button
          onClick={() => navigate('/')}
          title="Voltar ao site"
          className="w-full flex items-center rounded-xl py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-sm"
          style={{ gap: collapsed ? 0 : 10, padding: collapsed ? '8px 0' : '8px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <span className="text-lg">🏠</span>
          {!collapsed && <span className="font-body">Voltar ao site</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="w-full flex items-center rounded-xl py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-sm"
          style={{ gap: collapsed ? 0 : 10, padding: collapsed ? '8px 0' : '8px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <span className="text-base">{collapsed ? '▶' : '◀'}</span>
          {!collapsed && <span className="font-body">Recolher</span>}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f8f9fb' }}>

      {/* Sidebar desktop */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Sidebar mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div style={{ width: 224 }} className="h-full">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
          <button onClick={() => setMobileOpen(true)} aria-label="Abrir menu"
            className="text-2xl" style={{ color: GREEN }}>
            ☰
          </button>
          <span className="font-display font-bold text-sm" style={{ color: DARK }}>
            De Novo Não! — ERP
          </span>
        </div>

        {/* Topbar desktop — breadcrumb simples */}
        <div className="hidden md:flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100">
          <p className="text-xs text-gray-400 font-body">
            Sistema de gestão · <span style={{ color: GREEN }}>Turma do Bem</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="text-xs text-gray-400 font-body">Online</span>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
