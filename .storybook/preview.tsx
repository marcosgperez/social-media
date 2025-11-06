import type { Preview } from '@storybook/react';
import React from 'react';
import '../styles/globals.css';

// Make React available globally for all stories
(window as any).React = React;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
