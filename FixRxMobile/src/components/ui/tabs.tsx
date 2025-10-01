import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";

type Route = { key: string; title: string };

export function Tabs({
  routes,
  scenes,
}: {
  routes: Route[];
  scenes: { [key: string]: React.ComponentType<any> };
}) {
  const [index, setIndex] = useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap(scenes)}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabsList>
          {props.navigationState.routes.map((route, i) => (
            <TabsTrigger
              key={route.key}
              title={route.title}
              active={index === i}
              onPress={() => setIndex(i)}
            />
          ))}
        </TabsList>
      )}
    />
  );
}

function TabsList({ children }: { children: React.ReactNode }) {
  return <View style={styles.tabList}>{children}</View>;
}

function TabsTrigger({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabTrigger, active && styles.activeTab]}
    >
      <Text style={[styles.tabText, active && styles.activeText]}>{title}</Text>
    </TouchableOpacity>
  );
}

function TabsContent({ children }: { children: React.ReactNode }) {
  return <View style={styles.tabContent}>{children}</View>;
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 3,
    marginBottom: 8,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
});
