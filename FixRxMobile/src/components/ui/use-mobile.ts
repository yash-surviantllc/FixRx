import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get("window");
      setIsMobile(width < MOBILE_BREAKPOINT);
    };

    updateLayout(); // run initially
    const subscription = Dimensions.addEventListener("change", updateLayout);

    return () => {
      subscription?.remove();
    };
  }, []);

  return isMobile;
}
