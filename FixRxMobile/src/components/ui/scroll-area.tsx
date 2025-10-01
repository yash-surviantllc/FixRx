import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";

interface ScrollAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  horizontal?: boolean;
}

export function ScrollArea({ children, style, horizontal = false }: ScrollAreaProps) {
  return (
    <ScrollView
      style={[styles.root, style]}
      horizontal={horizontal}
      showsVerticalScrollIndicator
      showsHorizontalScrollIndicator
    >
      {children}
    </ScrollView>
  );
}

// In React Native, ScrollView already handles scrollbars,
// so ScrollBar component is optional.
// Keeping it here as a placeholder for compatibility.
export function ScrollBar() {
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
