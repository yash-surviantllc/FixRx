import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Circle } from "./icons";

interface RadioGroupProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (val: string) => void;
}

export function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  const [selected, setSelected] = useState(value || "");

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <View style={styles.group}>
      {options.map((opt) => (
        <RadioGroupItem
          key={opt.value}
          label={opt.label}
          selected={selected === opt.value}
          onPress={() => handleSelect(opt.value)}
        />
      ))}
    </View>
  );
}

interface RadioGroupItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioGroupItem({ label, selected, onPress }: RadioGroupItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {selected && <Circle size={10} color="#000" fill="#000" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  circleSelected: {
    borderColor: "#000",
  },
  label: {
    fontSize: 14,
    color: "#000",
  },
});
