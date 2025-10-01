import React, { createContext, useContext, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ToggleGroupContextType = {
  value: string | null;
  onChange: (val: string) => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextType | null>(null);

type ToggleGroupProps = {
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  style?: any;
};

export function ToggleGroup({ value, onValueChange, children, style }: ToggleGroupProps) {
  const [selected, setSelected] = useState(value ?? null);

  const handleChange = (val: string) => {
    setSelected(val);
    onValueChange?.(val);
  };

  return (
    <ToggleGroupContext.Provider value={{ value: selected, onChange: handleChange }}>
      <View style={[styles.group, style]}>{children}</View>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = {
  value: string;
  children: React.ReactNode;
  style?: any;
};

export function ToggleGroupItem({ value, children, style }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  if (!context) throw new Error("ToggleGroupItem must be used inside ToggleGroup");

  const isActive = context.value === value;

  return (
    <TouchableOpacity
      onPress={() => context.onChange(value)}
      style={[styles.item, isActive && styles.activeItem, style]}
    >
      <Text style={[styles.itemText, isActive && styles.activeText]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
  },
  activeItem: {
    backgroundColor: "#4f46e5",
  },
  itemText: {
    fontSize: 14,
    color: "#374151",
  },
  activeText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
