import React from "react";
import { Switch as RNSwitch } from "react-native";

type SwitchProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
};

export function Switch({ value, onValueChange, disabled }: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: "#ccc", true: "#4f46e5" }} // gray off, indigo on
      thumbColor={value ? "#ffffff" : "#f4f4f4"} // white thumb
      ios_backgroundColor="#ccc"
    />
  );
}
