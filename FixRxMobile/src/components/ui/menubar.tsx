import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { Check, ChevronRight, Circle } from "./icons";

type MenuItem = {
  id: string;
  label: string;
  variant?: "default" | "destructive";
  checked?: boolean;
  shortcut?: string;
  subItems?: MenuItem[];
};

interface MenubarProps {
  items: MenuItem[];
  onSelect?: (id: string) => void;
}

export default function Menubar({ items, onSelect }: MenubarProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.trigger,
              item.variant === "destructive" && styles.destructive,
            ]}
            onPress={() => onSelect?.(item.id)}
          >
            {item.checked && <Check size={16} color="#000" />}
            <Text style={styles.label}>{item.label}</Text>
            {item.subItems && <ChevronRight size={16} color="#000" />}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    marginLeft: 6,
  },
  destructive: {
    color: "red",
  },
});
