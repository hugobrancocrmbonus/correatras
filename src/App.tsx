import { useState } from 'react'
import { AdminLayout } from '@layouts/AdminLayout'
import { TopBar } from '@ds/TopBar/TopBar'
import { Sidebar } from '@ds/Sidebar/Sidebar'
import { BrandDrawer, type Brand } from '@ds/BrandDrawer/BrandDrawer'
import { AgentsPage } from './pages/AgentsPage'
import { CorreAtrasPage } from './pages/CorreAtrasPage'

type Page = 'agents' | 'corre-atras'

const MOCK_BRANDS: Brand[] = [
  { id: '1', name: 'Vivara',       csResponsavel: 'Ana Souza',   logoSrc: 'https://www.figma.com/api/mcp/asset/ed5eb695-3595-48dd-93e0-e44987eaafd9' },
  { id: '2', name: 'Corello',      csResponsavel: 'Bruno Lima' },
  { id: '3', name: 'Shoulder',     csResponsavel: 'Carla Dias' },
  { id: '4', name: 'Arezzo',       csResponsavel: 'Diego Mota' },
  { id: '5', name: 'Chilli Beans', csResponsavel: 'Elisa Rocha' },
  { id: '6', name: 'Farm',         csResponsavel: 'Felipe Neto' },
  { id: '7', name: 'Reserva',      csResponsavel: 'Gabi Torres' },
]

// Ícone de Agentes IA — seta diagonal (↗)
function IconAgentes() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function App() {
  const [theme, setTheme]             = useState<'light' | 'dark'>('dark')
  const [sidebarExpanded, setSidebar] = useState(false)
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [activeBrand, setActiveBrand] = useState<Brand | undefined>(MOCK_BRANDS[0])
  const [activeNav, setActiveNav]     = useState('agents')
  const [page, setPage]               = useState<Page>('agents')

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  if (typeof document !== 'undefined') {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const navItems = [
    {
      id: 'agents',
      label: 'Agentes IA',
      icon: <IconAgentes />,
      active: activeNav === 'agents',
      onClick: () => setActiveNav('agents'),
    },
  ]

  return (
    <>
      <AdminLayout
        sidebarExpanded={sidebarExpanded}
        topBar={
          <TopBar
            theme={theme}
            breadcrumb={
              page === 'agents'
                ? [{ label: 'Página inicial' }, { label: 'Agentes IA' }]
                : [{ label: 'Página inicial' }, { label: 'Agentes IA', onClick: () => setPage('agents') }, { label: 'Corre Atrás' }]
            }
            showLegacyButton
            brandLogoSrc={activeBrand?.logoSrc}
            brandName={activeBrand?.name}
            onChangeBrand={() => setDrawerOpen(true)}
            avatarAlt="HB"
          />
        }
        sidebar={
          <Sidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebar(v => !v)}
            items={navItems}
          />
        }
      >
        {page === 'agents'
          ? <AgentsPage onSelectAgent={() => setPage('corre-atras')} />
          : <CorreAtrasPage />
        }
      </AdminLayout>

      <BrandDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        brands={MOCK_BRANDS}
        selectedBrandId={activeBrand?.id}
        mode={activeBrand ? 'change' : 'enabled'}
        onConfirm={brand => setActiveBrand(brand)}
      />
    </>
  )
}
