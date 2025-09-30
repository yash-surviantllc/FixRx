import React from 'react';

// Import your global CSS files
import '../src/index.css';
import '../src/styles/globals.css';
import './global.css';

// Export parameters and decorators directly
export const parameters = {
  // Add global parameters here
  layout: 'centered',
  controls: {
    expanded: true,
  },
};

// Add global decorators
export const decorators = [
  (Story) => (
    <div className="bg-background text-foreground min-h-screen p-4">
      <Story />
    </div>
  ),
];
