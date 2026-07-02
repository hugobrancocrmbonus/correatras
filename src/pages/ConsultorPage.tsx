import { useState, useRef, useEffect } from 'react'

/* ── types ─────────────────────────────────────────────────────────── */

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  typing?: boolean
}

/* ── mock responses ────────────────────────────────────────────────── */

const RESPONSES: Record<string, string> = {
  default:
    'Posso te ajudar com métricas, campanhas, lojas e clientes do Agente IA. Tenta perguntar algo como "qual campanha performou melhor?" ou "quantos clientes resgataram?".',
}

function getResponse(input: string): string {
  const q = input.toLowerCase()

  if (q.includes('performou') || q.includes('melhor campanha') || q.includes('resultado')) {
    return `A campanha **"Última chance – Corre atrás"** foi a que mais performou até agora:\n\n• **1.243 mensagens enviadas**\n• **18% de taxa de conversão** (média histórica: 12%)\n• **R$ 41.200 em vendas incrementais** atribuídas\n• Período ativo: 12/05 a 30/05/2025\n\nEla superou a média em 50% principalmente nas lojas da região Sul, onde o perfil de cliente inativo era mais recente (7 a 12 meses).`
  }
  if (q.includes('quantos clientes') || q.includes('resgataram') || q.includes('total de resgates')) {
    return `No total, **387 clientes** resgataram o bônus nas campanhas ativas:\n\n• Corre Atrás (maio): 224 resgates\n• Campanha Sul Q2: 98 resgates\n• Reativação SP – Inverno: 65 resgates\n\nO ticket médio das compras com bônus resgatado foi **R$ 487**, 34% acima do ticket médio sem bônus.`
  }
  if (q.includes('conversão') || q.includes('taxa')) {
    return `A **taxa de conversão média** das campanhas ativas é de **16,2%**.\n\n• Corre Atrás (maio): 18%\n• Campanha Sul Q2: 14%\n• Reativação SP – Inverno: 21% ← melhor taxa\n\nO benchmark do setor fica em torno de 8–10%, então estamos bem acima. O principal fator é o período de inatividade: clientes com 9 a 18 meses convertem melhor do que clientes mais recentes ou muito antigos.`
  }
  if (q.includes('loja') || q.includes('lojas') || q.includes('unidade')) {
    return `As **3 lojas com melhor desempenho** no Corre Atrás são:\n\n1. 🏆 **Loja Morumbi** — 23% de conversão, 89 resgates\n2. **Loja Interlagos** — 19% de conversão, 67 resgates\n3. **Loja Pinheiros** — 17% de conversão, 54 resgates\n\nAs lojas da zona Sul concentram 58% dos resgates totais. Recomendo ampliar o volume de disparos nessas unidades nas próximas campanhas.`
  }
  if (q.includes('perfil') || q.includes('cliente') || q.includes('quem')) {
    return `O **perfil dos clientes reativados** pelo Agente IA:\n\n• Faixa etária dominante: 32–45 anos\n• Gênero: 61% feminino, 39% masculino\n• Inatividade média no momento do envio: **14 meses**\n• Ticket médio histórico (antes da inatividade): R$ 520\n• Frequência média antes de parar: 2,3 compras/ano\n\nSão clientes com alto valor histórico que simplesmente "esqueceram" da marca — o lembrete com bônus é o gatilho ideal para eles.`
  }
  if (q.includes('horário') || q.includes('momento') || q.includes('quando enviar')) {
    return `Com base nas campanhas anteriores, os **melhores horários para envio** são:\n\n• **Terça e quarta-feira**, entre **10h e 12h** — taxa de abertura 28% maior\n• Evitar sextas e fins de semana (queda de 40% na conversão)\n• O tempo médio entre receber a mensagem e ativar o bônus é de **2,3 horas**\n\nRecomendação: programe os disparos para terça às 10h. Isso maximiza a chance de o cliente visitar a loja no mesmo dia ou no dia seguinte.`
  }
  if (q.includes('criar') || q.includes('nova campanha') || q.includes('configurar')) {
    return `Para criar uma nova campanha no Agente IA, você vai precisar definir:\n\n1. **Nome e status** — ative ou deixe em rascunho\n2. **Parâmetros de bônus** — percentual, valor mínimo e máximo\n3. **Volume de disparos** por loja por dia\n4. **Período de inatividade** — faixa de meses sem compra\n5. **Lojas participantes** — você pode filtrar por região\n6. **Mensagem** — use o template padrão ou personalize\n\nClique em **"Nova ação"** na tela de Corre Atrás para começar. Quer que eu te guie por alguma etapa específica?`
  }
  if (q.includes('bônus') || q.includes('bonus') || q.includes('valor')) {
    return `Os **parâmetros de bônus** mais eficientes nas campanhas ativas:\n\n• Percentual ideal: **15% a 25%** do valor da última compra\n• Bônus mínimo: **R$ 150** (abaixo disso a conversão cai muito)\n• Bônus máximo: **R$ 500** (acima disso o ROI não compensa)\n• O bônus médio efetivamente resgatado foi de **R$ 247**\n\nCampanhas com bônus entre R$ 200–300 tiveram conversão 22% maior do que as com bônus menor. Vale investir um pouco mais no tíquete mínimo.`
  }
  if (q.includes('roi') || q.includes('retorno') || q.includes('receita')) {
    return `O **ROI das campanhas ativas** do Corre Atrás:\n\n• Custo total em bônus concedidos: **R$ 95.700**\n• Receita incremental gerada: **R$ 188.500**\n• **ROI: 97%** — cada R$ 1 investido retornou R$ 1,97\n\nIsso sem contar o valor de retenção de longo prazo: clientes reativados tendem a comprar 1,8x nos 6 meses seguintes. O valor total do programa é provavelmente 2,5–3x o retorno imediato.`
  }

  return RESPONSES.default
}

/* ── suggested questions ───────────────────────────────────────────── */

const SUGGESTIONS = [
  'Qual campanha performou melhor?',
  'Quantos clientes resgataram no total?',
  'Qual é a taxa de conversão média?',
  'Quais lojas têm melhor resultado?',
  'Qual é o perfil dos clientes reativados?',
  'Quando é o melhor horário para enviar?',
]

/* ── markdown-like renderer (bold + line breaks) ───────────────────── */

function RenderText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j}>{part}</strong>
                : <span key={j}>{part}</span>
            )}
            {i < lines.length - 1 && <br />}
          </span>
        )
      })}
    </>
  )
}

/* ── typing indicator ──────────────────────────────────────────────── */

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: 'var(--crm-fg-neutral-weak)',
            display: 'inline-block',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/* ── bot avatar ────────────────────────────────────────────────────── */

function BotAvatar() {
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: 'var(--crm-btn-primary-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
          fill="currentColor" style={{ color: '#14171a' }} />
        <circle cx="12" cy="12" r="10" stroke="#14171a" strokeWidth="0" fill="none"/>
        <path d="M7 8h2v8H7zM15 8h2v8h-2z" fill="#14171a"/>
        <rect x="6" y="7" width="12" height="10" rx="2" fill="#14171a" opacity="0.1"/>
        <path d="M9 9l3 3 3-3M9 15l3-3 3 3" stroke="#14171a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/* ── main page ─────────────────────────────────────────────────────── */

export function ConsultorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const delay = 800 + Math.random() * 600
    setTimeout(() => {
      const reply = getResponse(text)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
      }])
      setIsTyping(false)
    }, delay)
  }

  const isEmpty = messages.length === 0

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--cds-bg-layer-01)',
      overflow: 'hidden',
    }}>

      {/* ── header ──────────────────────────────────────────────── */}
      <div style={{
        padding: '28px 32px 20px',
        borderBottom: '1px solid var(--cds-border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--crm-btn-primary-bg)', display: 'flex' }}>
            <SparkleIcon />
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--cds-text-primary)', margin: 0 }}>
            Consultor IA
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--cds-text-secondary)', margin: '4px 0 0 26px' }}>
          Tire dúvidas sobre campanhas, métricas e clientes do Agente IA
        </p>
      </div>

      {/* ── messages area ───────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* empty state */}
        {isEmpty && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, marginTop: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: 'rgba(230,148,0,0.12)',
                border: '1px solid rgba(230,148,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--crm-btn-primary-bg)',
              }}>
                <SparkleIcon />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary)', margin: 0 }}>
                O que você quer saber?
              </p>
              <p style={{ fontSize: 13, color: 'var(--cds-text-secondary)', margin: '6px 0 0' }}>
                Escolha uma sugestão ou escreva sua própria pergunta
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 680 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    backgroundColor: 'var(--cds-bg-layer-02)',
                    border: '1px solid var(--cds-border-subtle)',
                    borderRadius: 20,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--cds-text-primary)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--crm-btn-primary-bg)'
                    e.currentTarget.style.backgroundColor = 'rgba(230,148,0,0.07)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--cds-border-subtle)'
                    e.currentTarget.style.backgroundColor = 'var(--cds-bg-layer-02)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* messages */}
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            {msg.role === 'assistant' && <BotAvatar />}

            <div style={{
              maxWidth: 640,
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: msg.role === 'user'
                ? 'var(--crm-btn-primary-bg)'
                : 'var(--cds-bg-layer-02)',
              border: msg.role === 'assistant' ? '1px solid var(--cds-border-subtle)' : 'none',
              fontSize: 14,
              lineHeight: '22px',
              color: msg.role === 'user' ? 'var(--crm-btn-primary-text)' : 'var(--cds-text-primary)',
            }}>
              <RenderText text={msg.text} />
            </div>
          </div>
        ))}

        {/* typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <BotAvatar />
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px 16px 16px 4px',
              backgroundColor: 'var(--cds-bg-layer-02)',
              border: '1px solid var(--cds-border-subtle)',
            }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── input bar ───────────────────────────────────────────── */}
      <div style={{
        padding: '16px 32px 24px',
        borderTop: '1px solid var(--cds-border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          backgroundColor: 'var(--cds-bg-layer-02)',
          border: '1px solid var(--cds-border-subtle)',
          borderRadius: 12,
          padding: '10px 16px',
          transition: 'border-color 0.15s',
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--crm-btn-primary-bg)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--cds-border-subtle)'}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            placeholder="Pergunte sobre campanhas, métricas, clientes..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: 'var(--cds-text-primary)',
              lineHeight: '22px',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: input.trim() && !isTyping ? 'var(--crm-btn-primary-bg)' : 'var(--cds-bg-layer-03)',
              border: 'none',
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke={input.trim() && !isTyping ? '#14171a' : 'var(--crm-fg-neutral-weak)'}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--cds-text-secondary)', textAlign: 'center', margin: '8px 0 0' }}>
          Respostas simuladas com dados de demonstração
        </p>
      </div>

    </div>
  )
}
