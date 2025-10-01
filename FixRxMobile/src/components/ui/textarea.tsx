import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = TextInputProps;

export function Textarea({ style, ...props }: Props) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      multiline
      placeholderTextColor="#9ca3af" // muted placeholder
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 64, // like min-h-16
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db", // border-input
    backgroundColor: "#fff", // bg-input-background
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
});
