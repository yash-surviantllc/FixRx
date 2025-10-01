import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { PanelLeft } from "./icons";

type SidebarContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  side = "left",
}: {
  children: ReactNode;
  side?: "left" | "right";
}) {
  const { open, setOpen } = useSidebar();

  return (
    <Modal transparent visible={open} animationType="slide">
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View
        style={[
          styles.sidebar,
          side === "right" ? { right: 0 } : { left: 0 },
        ]}
      >
        {children}
      </View>
    </Modal>
  );
}

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Pressable style={styles.trigger} onPress={toggleSidebar}>
      <PanelLeft size={20} color="#000" />
    </Pressable>
  );
}

export function SidebarHeader({ children }: { children: ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function SidebarContent({ children }: { children: ReactNode }) {
  return <View style={styles.content}>{children}</View>;
}

export function SidebarGroup({ children }: { children: ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

export function SidebarGroupLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.groupLabel}>{children}</Text>;
}

export function SidebarSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "#fff",
    padding: 16,
    elevation: 6,
  },
  trigger: {
    padding: 8,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
  },
  content: {
    flex: 1,
  },
  group: {
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
});
