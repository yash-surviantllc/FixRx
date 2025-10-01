import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

type TooltipProps = {
  children: React.ReactNode;     // the trigger element
  content: string;               // tooltip text
};

export function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
      >
        {children}
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        style={styles.modal}
      >
        <View style={styles.tooltipBox}>
          <Text style={styles.tooltipText}>{content}</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  tooltipBox: {
    backgroundColor: "#4f46e5", // primary
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tooltipText: {
    fontSize: 12,
    color: "#fff",
  },
}
);
