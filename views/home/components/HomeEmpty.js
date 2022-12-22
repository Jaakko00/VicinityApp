import * as React from "react";
import { useContext } from "react";
import { Text, View } from "react-native";

import { ThemeContext } from "../../../App";

export default function HomeEmpty({ loading }) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    emptyContainer: {
      width: "80%",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    emptyText: {
      color: theme.colors.textSecondary,
      fontFamily: "Futura",
      fontSize: 18,
    },
  };

  return (
    <View style={styles.emptyContainer}>
      {loading ? (
        <Text style={styles.emptyText}>Loading posts...</Text>
      ) : (
        <Text style={styles.emptyText}>No posts in your area 🙁</Text>
      )}
    </View>
  );
}
