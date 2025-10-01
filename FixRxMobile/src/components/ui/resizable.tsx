import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { GripVertical } from "./icons";

interface ResizablePanelGroupProps {
  children: React.ReactNode[];
  direction?: "horizontal" | "vertical";
}

export function ResizablePanelGroup({
  children,
  direction = "horizontal",
}: ResizablePanelGroupProps) {
  return (
    <View
      style={[
        styles.group,
        direction === "vertical" && styles.groupVertical,
      ]}
    >
      {children}
    </View>
  );
}

interface ResizablePanelProps {
  children: React.ReactNode;
  flex?: number;
}

export function ResizablePanel({ children, flex = 1 }: ResizablePanelProps) {
  return <View style={{ flex }}>{children}</View>;
}

interface ResizableHandleProps {
  onResize?: (delta: number) => void;
  direction?: "horizontal" | "vertical";
}

export function ResizableHandle({
  onResize,
  direction = "horizontal",
}: ResizableHandleProps) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (onResize) {
        const delta =
          direction === "horizontal" ? gestureState.dx : gestureState.dy;
        onResize(delta);
      }
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.handle,
        direction === "vertical" && styles.handleVertical,
      ]}
    >
      <GripVertical size={16} color="#333" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  groupVertical: {
    flexDirection: "column",
  },
  handle: {
    width: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
  },
  handleVertical: {
    height: 10,
    width: "100%",
  },
});
