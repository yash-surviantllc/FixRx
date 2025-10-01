import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "./icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {/* Previous */}
      <Pressable
        style={[styles.navButton, currentPage === 1 && styles.disabled]}
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} color={currentPage === 1 ? "#999" : "#000"} />
        <Text style={styles.navText}>Previous</Text>
      </Pressable>

      {/* Page Numbers */}
      <View style={styles.pages}>
        {pages.map((page) => (
          <Pressable
            key={page}
            style={[styles.pageButton, page === currentPage && styles.active]}
            onPress={() => onPageChange(page)}
          >
            <Text
              style={[
                styles.pageText,
                page === currentPage && styles.activeText,
              ]}
            >
              {page}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Next */}
      <Pressable
        style={[
          styles.navButton,
          currentPage === totalPages && styles.disabled,
        ]}
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <Text style={styles.navText}>Next</Text>
        <ChevronRight
          size={16}
          color={currentPage === totalPages ? "#999" : "#000"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#f2f2f2",
  },
  navText: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  disabled: {
    backgroundColor: "#e0e0e0",
  },
  pages: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  pageText: {
    fontSize: 14,
    color: "#333",
  },
  active: {
    backgroundColor: "#000",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
