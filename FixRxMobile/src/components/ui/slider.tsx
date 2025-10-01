import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from "react-native";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (val: number) => void;
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  onChange,
}: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const animatedX = useRef(new Animated.Value(0)).current;

  // Current value (controlled or uncontrolled)
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;

  // Pan responder for thumb dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newX = Math.max(0, Math.min(gesture.dx + (currentValue / max) * trackWidth, trackWidth));
        let newValue = min + (newX / trackWidth) * (max - min);
        setInternalValue(newValue);
        onChange?.(Math.round(newValue));
        animatedX.setValue(newX);
      },
    })
  ).current;

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setTrackWidth(width);
    const initialX = ((currentValue - min) / (max - min)) * width;
    animatedX.setValue(initialX);
  };

  return (
    <View style={styles.container}>
      {/* Track */}
      <View style={styles.track} onLayout={handleTrackLayout}>
        {/* Range */}
        <Animated.View
          style={[
            styles.range,
            { width: animatedX.interpolate({
                inputRange: [0, trackWidth],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
        {/* Thumb */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            { transform: [{ translateX: animatedX }] },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    overflow: "hidden",
  },
  range: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#3B82F6", // primary color
  },
  thumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
});
