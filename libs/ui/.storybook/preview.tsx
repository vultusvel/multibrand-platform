import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

// Lato (self-hosted, no next/font in a framework-agnostic UI library)
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' shows a11y violations as warnings, 'error' fails the run
      test: 'todo',
    },
  },
  decorators: [
    // Brand switcher in the Storybook toolbar (wilko / Homebase / Bathstore)
    withThemeByClassName({
      themes: {
        wilko: 'theme-wilko',
        Homebase: 'theme-homebase',
        Bathstore: 'theme-bathstore',
      },
      defaultTheme: 'wilko',
    }),
  ],
};

export default preview;
