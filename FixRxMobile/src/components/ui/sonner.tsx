import React from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { StyleSheet } from "react-native";

/**
 * Toaster component for React Native.
 * Drop <Toaster /> once in your App root.
 */
const Toaster = () => (
  <Toast
    config={{
      success: (props) => (
        <BaseToast
          {...props}
          style={styles.success}
          text1Style={styles.text}
          text2Style={styles.text}
        />
      ),
      error: (props) => (
        <ErrorToast
          {...props}
          style={styles.error}
          text1Style={styles.text}
          text2Style={styles.text}
        />
      ),
    }}
  />
);

export { Toaster };

const styles = StyleSheet.create({
  success: { borderLeftColor: "green" },
  error: { borderLeftColor: "red" },
  text: { fontSize: 14 },
});
