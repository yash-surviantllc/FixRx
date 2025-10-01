import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { ChevronDown } from "./icons";

type NavItem = {
  id: string;
  label: string;
  subItems?: NavItem[];
};

interface NavigationMenuProps {
  items: NavItem[];
  onSelect?: (id: string) => void;
}

export default function NavigationMenu({ items, onSelect }: NavigationMenuProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  const renderItem = ({ item }: { item: NavItem }) => (
    <View style={styles.menuItem}>
      <Pressable
        style={styles.trigger}
        onPress={() => {
          if (item.subItems) {
            toggleItem(item.id);
          } else {
            onSelect?.(item.id);
          }
        }}
      >
        <Text style={styles.label}>{item.label}</Text>
        {item.subItems && (
          <ChevronDown
            size={16}
            style={{
              transform: [{ rotate: openItem === item.id ? "180deg" : "0deg" }],
            }}
          />
        )}
      </Pressable>

      {openItem === item.id && item.subItems && (
        <View style={styles.subMenu}>
          {item.subItems.map((sub) => (
            <Pressable
              key={sub.id}
              style={styles.subItem}
              onPress={() => onSelect?.(sub.id)}
            >
              <Text style={styles.subLabel}>{sub.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 4,
  },
  menuItem: {
    marginVertical: 2,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  subMenu: {
    marginLeft: 16,
    marginTop: 4,
    borderLeftWidth: 1,
    borderColor: "#eee",
  },
  subItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  subLabel: {
    fontSize: 13,
    color: "#333",
  },
});
