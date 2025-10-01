import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

type TableProps = {
  children: React.ReactNode;
  style?: object;
};

export function Table({ children, style }: TableProps) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={[styles.tableContainer, style]}
    >
      <View style={styles.table}>{children}</View>
    </ScrollView>
  );
}

export function TableHeader({ children, style }: TableProps) {
  return <View style={[styles.tableHeader, style]}>{children}</View>;
}

export function TableBody({ children, style }: TableProps) {
  return <View style={[styles.tableBody, style]}>{children}</View>;
}

export function TableFooter({ children, style }: TableProps) {
  return <View style={[styles.tableFooter, style]}>{children}</View>;
}

export function TableRow({ children, style }: TableProps) {
  return <View style={[styles.tableRow, style]}>{children}</View>;
}

export function TableHead({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <Text style={[styles.tableHead, style]}>{children}</Text>;
}

export function TableCell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <Text style={[styles.tableCell, style]}>{children}</Text>;
}

export function TableCaption({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <Text style={[styles.tableCaption, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
  },
  table: {
    flexDirection: "column",
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
  },
  tableBody: {
    flexDirection: "column",
  },
  tableFooter: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tableHead: {
    fontWeight: "bold",
    padding: 8,
  },
  tableCell: {
    padding: 8,
  },
  tableCaption: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
