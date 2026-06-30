import type { CSSProperties } from 'react'

interface Campaign {
  id: string
  name: string
  status: 'ativa' | 'pausada'
  totalEnvios: number
  conversao: string
  lojas: number
  criadaEm: string
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Última chance – Corre atrás', status: 'ativa',   totalEnvios: 1243, conversao: '18%', lojas: 12, criadaEm: '12/05/2025' },
  { id: '2', name: 'Campanha Sul Q2',             status: 'pausada', totalEnvios:  892, conversao: '14%', lojas:  7, criadaEm: '03/03/2025' },
  { id: '3', name: 'Reativação SP – Inverno',     status: 'ativa',   totalEnvios: 2100, conversao: '21%', lojas: 18, criadaEm: '15/01/2025' },
]

const thStyle: CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  color: 'var(--cds-text-secondary)',
  whiteSpace: 'nowrap',
}

const tdStyle: CSSProperties = {
  padding: '16px',
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  color: 'var(--cds-text-primary)',
}

function StatusBadge({ status }: { status: 'ativa' | 'pausada' }) {
  const isAtiva = status === 'ativa'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 500,
      backgroundColor: isAtiva ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.15)',
      color: isAtiva ? '#22c55e' : '#9eaab3',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
      {isAtiva ? 'Ativa' : 'Pausada'}
    </span>
  )
}

interface CampaignListPageProps {
  onCreateCampaign: () => void
  onSelectCampaign: (id: string) => void
}

export function CampaignListPage({ onCreateCampaign, onSelectCampaign }: CampaignListPageProps) {
  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.3, color: 'var(--cds-text-primary)', margin: 0 }}>
            Corre Atrás
          </h1>
          <p style={{ fontSize: 14, color: 'var(--cds-text-secondary)', margin: '4px 0 0' }}>
            Seleciona e reativa clientes inativos com alto potencial de retorno
          </p>
        </div>

        <button
          onClick={onCreateCampaign}
          style={{
            backgroundColor: 'var(--crm-btn-primary-bg)',
            color: 'var(--crm-btn-primary-text)',
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            lineHeight: '20px',
          }}
        >
          + Nova ação
        </button>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'var(--cds-bg-layer-02)',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--cds-border-subtle)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--cds-border-subtle)' }}>
              <th style={thStyle}>Nome da campanha</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Total de envios</th>
              <th style={thStyle}>Conversão</th>
              <th style={thStyle}>Lojas ativas</th>
              <th style={thStyle}>Criada em</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CAMPAIGNS.map((c, i) => (
              <tr
                key={c.id}
                onClick={() => onSelectCampaign(c.id)}
                style={{
                  borderBottom: i < MOCK_CAMPAIGNS.length - 1 ? '1px solid var(--cds-border-subtle)' : undefined,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--cds-bg-layer-03)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
              >
                <td style={{ ...tdStyle, fontWeight: 500 }}>{c.name}</td>
                <td style={tdStyle}><StatusBadge status={c.status} /></td>
                <td style={tdStyle}>{c.totalEnvios.toLocaleString('pt-BR')}</td>
                <td style={tdStyle}>{c.conversao}</td>
                <td style={tdStyle}>{c.lojas}</td>
                <td style={tdStyle}>{c.criadaEm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
