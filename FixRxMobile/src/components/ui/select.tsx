import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { ChevronDown, ChevronUp, Check } from "./icons";

interface SelectItem {
  label: string;
  value: string;
}

interface SelectProps {
  items: SelectItem[];
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

export default function Select({
  items,
  value,
  placeholder = "Select an option",
  onChange,
}: SelectProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    items.find((item) => item.value === value)?.label || placeholder;

  return (
    <View>
      {/* Trigger */}
      <Pressable style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>{selectedLabel}</Text>
        <ChevronDown size={16} color="#333" />
      </Pressable>

      {/* Dropdown */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.item}
                  onPress={() => {
                    onChange?.(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                  {item.value === value && <Check size={16} color="#000" />}
                </Pressable>
              )}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <ChevronUp size={18} color="#333" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  triggerText: {
    fontSize: 14,
    color: "#000",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 300,
    width: "100%",
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
