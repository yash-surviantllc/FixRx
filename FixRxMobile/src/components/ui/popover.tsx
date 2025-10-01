import React, { useState, ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
}

export default function Popover({ trigger, content }: PopoverProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      {/* Trigger */}
      <Pressable onPress={() => setVisible(true)}>{trigger}</Pressable>

      {/* Content */}
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.content}>{content}</View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 280,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
