
import React from 'react';
import type { Story } from '@ladle/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../.figma_internal/deleted/components/ui/accordion';

export default {
  title: 'Components/Accordion',
  component: Accordion,
};

const Template: Story = (args) => (
  <div className="p-4">
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const Default = Template.bind({});
Default.args = {};
