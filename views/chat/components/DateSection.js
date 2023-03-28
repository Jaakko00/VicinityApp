import { MaterialCommunityIcons } from "@expo/vector-icons";

import moment from "moment";
import React, {useContext} from "react";

import { Text, View } from "react-native";
import getTime from "../../../utils/getTime";
import { ThemeContext } from "../../../App";

export default function DateSection(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    footer: {
      margin: 10,
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.background,
      padding: 10,
      borderRadius: "50%",
    },
    text: {
      fontFamily: "Futura",
      color: theme.colors.textSecondary,
    },
  };
  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        <Text style={styles.text}>{getTime(props.date)}</Text>
      </View>
    </View>
  );
}
