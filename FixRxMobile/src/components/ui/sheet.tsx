import React, { useState, ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { X } from "./icons";

interface SheetProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function Sheet({ trigger, children, side = "right" }: SheetProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      {/* Trigger */}
      <Pressable onPress={() => setVisible(true)}>{trigger}</Pressable>

      {/* Sheet */}
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.content,
            side === "right" && styles.right,
            side === "left" && styles.left,
            side === "top" && styles.top,
            side === "bottom" && styles.bottom,
          ]}
        >
          <Pressable
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <X size={20} color="#333" />
          </Pressable>
          {children}
        </View>
      </Modal>
    </View>
  );
}

export function SheetHeader({ children }: { children: ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SheetFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SheetTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function SheetDescription({ children }: { children: ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    width: "75%",
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    width: "75%",
  },
  top: {
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  header: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
