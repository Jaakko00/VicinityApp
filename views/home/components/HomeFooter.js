import * as React from "react";
import { useContext } from "react";
import { Text, View } from "react-native";

import { ThemeContext } from "../../../App";

export default function HomeFooter(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    footerContainer: {
      width: "80%",
      borderTopWidth: 2,
      borderColor: theme.colors.textSecondary,
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      padding: theme.size.paddingBig
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontFamily: "Futura",
      fontSize: 14,
    },
  };

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>No more posts in your area</Text>
    </View>
  );
}
