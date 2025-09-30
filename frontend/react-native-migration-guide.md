# React Native Migration Guide

## Overview
This guide outlines the migration process from TypeScript React (web) to React Native while preserving styles and functionality.

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Shared components
│   │   ├── native/          # React Native specific components
│   │   └── web/             # Web specific components (legacy)
│   ├── screens/             # React Native screens
│   ├── navigation/          # React Navigation setup
│   ├── styles/              # Shared styles
│   │   ├── colors.ts        # Color constants
│   │   ├── typography.ts    # Typography styles
│   │   └── spacing.ts       # Spacing constants
│   ├── utils/               # Utility functions
│   │   └── styleConverter.ts # Tailwind to RN style converter
│   └── App.native.tsx       # React Native entry point
```

## Key Dependencies for React Native

```json
{
  "dependencies": {
    "react-native": "^0.72.0",
    "react-native-safe-area-context": "^4.7.0",
    "react-native-screens": "^3.25.0",
    "react-native-svg": "^13.14.0",
    "react-native-gesture-handler": "^2.13.0",
    "react-native-reanimated": "^3.5.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-hook-form": "^7.55.0",
    "lucide-react-native": "^0.544.0"
  }
}
```

## Component Migration Strategy

### 1. Form Components
- Replace Radix UI with native form components
- Use react-hook-form for form state management
- Create custom form components with similar API

### 2. UI Components
- Accordion → Custom RN Accordion with Animated API
- Dialog/Modal → React Native Modal
- Dropdown → Custom Picker component
- Button → TouchableOpacity/Pressable
- Input → TextInput with custom styling

### 3. Layout Components
- Replace div → View
- Replace span/p → Text
- Replace img → Image
- ScrollView for scrollable content
- FlatList for lists

### 4. Navigation
- React Router → React Navigation
- Bottom tabs for main navigation
- Stack navigator for screen flows

## Style Migration

### Tailwind to React Native StyleSheet
- Create a style converter utility
- Map Tailwind classes to RN styles
- Use StyleSheet.create for performance
- Implement theme system with context

## Migration Steps

1. **Phase 1: Setup**
   - Initialize React Native project
   - Install dependencies
   - Set up navigation structure

2. **Phase 2: Core Components**
   - Migrate base UI components
   - Create style system
   - Set up theme provider

3. **Phase 3: Screens**
   - Convert screens one by one
   - Maintain web compatibility
   - Test on both platforms

4. **Phase 4: Integration**
   - Connect API services
   - Implement state management
   - Add authentication flow

5. **Phase 5: Testing**
   - Unit tests for components
   - Integration tests
   - Platform-specific testing
