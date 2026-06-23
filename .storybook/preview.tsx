import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/tokens/index.css'
import '../src/index.css'

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
        { name: 'dark', value: '#121416' },
        { name: 'light', value: '#f4f7fa' },
      ],
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      const bg = context.globals?.backgrounds?.value ?? '#121416'
      const isDark = bg === '#121416'

      useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      }, [isDark])

      return (
        <div
          data-theme={isDark ? 'dark' : 'light'}
          style={{
            backgroundColor: bg,
            minHeight: '100vh',
            padding: 32,
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
