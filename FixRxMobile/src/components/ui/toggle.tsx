import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type ToggleProps = {
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Toggle({
  children,
  variant = "default",
  size = "default",
  onPress,
  disabled,
  style,
  textStyle,
}: ToggleProps) {
  const [active, setActive] = useState(false);

  const handlePress = () => {
    setActive(!active);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.base,
        sizeStyles[size],
        variant === "outline" && styles.outline,
        active && styles.active,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.activeText,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
    margin: 2,
  },
  outline: {
    borderWidth: 1,
    borderColor: "#d1d5db", // light gray
  },
  active: {
    backgroundColor: "#4f46e5", // indigo
  },
  text: {
    fontSize: 14,
    color: "#374151", // gray-700
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#9ca3af",
  },
});

const sizeStyles = StyleSheet.create({
  default: {
    height: 36,
    minWidth: 36,
    paddingHorizontal: 8,
  },
  sm: {
    height: 32,
    minWidth: 32,
    paddingHorizontal: 6,
  },
  lg: {
    height: 40,
    minWidth: 40,
    paddingHorizontal: 10,
  },
});
