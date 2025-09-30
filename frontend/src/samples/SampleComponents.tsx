// src/samples/AccordionSample.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

// Create a simple Accordion component
const Accordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <View style={[styles.chevron, isOpen && styles.chevronOpen]}>
          <ChevronDown size={20} color="#4b5563" />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const TouchableOpacity = ({ children, style, onPress, activeOpacity }: any) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <View 
      style={[
        style,
        isPressed && { opacity: 0.7 }
      ]}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        onPress?.();
      }}
    >
      {children}
    </View>
  );
};

// Sample page component
const AccordionSample = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UI Components</Text>
        <Text style={styles.subtitle}>Interactive Component Showcase</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accordion</Text>
        
        <Accordion title="Basic Usage">
          <Text style={styles.contentText}>
            This is a simple accordion component. Click the header to expand or collapse the content.
          </Text>
        </Accordion>

        <Accordion title="With More Content">
          <View style={styles.content}>
            <Text style={styles.contentText}>
              This accordion contains more detailed content. You can put any React Native components inside.
            </Text>
            <View style={styles.demoBox}>
              <Text>Example content</Text>
            </View>
          </View>
        </Accordion>

        <Accordion title="Custom Styling">
          <View style={styles.customContent}>
            <Text style={styles.customText}>Custom styled content area</Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Click me</Text>
            </View>
          </View>
        </Accordion>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  accordionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
    transition: 'transform 0.2s',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  content: {
    padding: 8,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  demoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    alignItems: 'center',
  },
  customContent: {
    padding: 8,
  },
  customText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default AccordionSample;