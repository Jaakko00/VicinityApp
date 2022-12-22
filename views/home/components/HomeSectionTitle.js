import * as React from "react";
import { useContext } from "react";
import { Text, View } from "react-native";

import { ThemeContext } from "../../../App";

export default function HomeSectionTitle(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    headerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      padding: theme.size.paddingBig,
    },
    headerText: {
      color: theme.colors.textSecondary,
      fontFamily: "Futura",
      fontSize: 14,
    },
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{props.text}</Text>
    </View>
  );
}
