import React from 'react';
import type { Story } from '@ladle/react';
import { Button } from '../.figma_internal/deleted/components/ui/button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      control: { type: 'select' },
    },
    size: {
      options: ['default', 'sm', 'lg', 'icon'],
      control: { type: 'select' },
    },
    children: {
      control: { type: 'text' },
    },
  },
};

const Template: Story = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Click me',
  variant: 'default',
  size: 'default',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Secondary',
  variant: 'secondary',
};

export const Outline = Template.bind({});
Outline.args = {
  children: 'Outline',
  variant: 'outline',
};

export const Small = Template.bind({});
Small.args = {
  children: 'Small',
  size: 'sm',
};
