import type { Preview } from '@storybook/react-vite'
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
    (Story) => (
      <div style={{ backgroundColor: '#121416', minHeight: '100vh', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
}

export default preview
