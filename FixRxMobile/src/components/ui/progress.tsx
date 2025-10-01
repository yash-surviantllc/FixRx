import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface ProgressProps {
  value: number; // 0 to 100
}

export default function Progress({ value }: ProgressProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.indicator, { width: widthInterpolated }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 8,
    width: "100%",
    backgroundColor: "rgba(0, 0, 255, 0.2)", // light primary background
    borderRadius: 999,
    overflow: "hidden",
  },
  indicator: {
    height: "100%",
    backgroundColor: "#0000FF", // primary color
  },
});
