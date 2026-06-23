import type { Preview } from '@storybook/react-vite'
import '../src/tokens/index.css'
import '../src/index.css'

const DARK_BG  = '#121416'
const LIGHT_BG = '#f4f7fa'

function resolveBg(globals: Record<string, unknown>): string {
  const raw = globals?.backgrounds
  if (!raw) return DARK_BG
  if (typeof raw === 'string') return raw === 'light' ? LIGHT_BG : DARK_BG
  if (typeof raw === 'object' && raw !== null) {
    const val = (raw as Record<string, unknown>).value
    if (typeof val === 'string') return val
  }
  return DARK_BG
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark',  value: DARK_BG  },
        { name: 'light', value: LIGHT_BG },
      ],
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      const bg      = resolveBg(context.globals as Record<string, unknown>)
      const isLight = bg === LIGHT_BG

      // Dark é o padrão (:root) — só precisa setar atributo para light mode.
      // Aplica no documentElement para cobrir elementos fixed/portalizados.
      if (typeof document !== 'undefined') {
        if (isLight) {
          document.documentElement.setAttribute('data-theme', 'light')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }

      return (
        <div
          data-theme={isLight ? 'light' : undefined}
          style={{ backgroundColor: bg, minHeight: '100vh', padding: 32 }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
