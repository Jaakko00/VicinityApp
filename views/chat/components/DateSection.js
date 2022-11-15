import { MaterialCommunityIcons } from "@expo/vector-icons";

import moment from "moment";
import * as React from "react";

import { Text, View } from "react-native";
import getTime from "../../../utils/getTime";

export default function DateSection(props) {
  const styles = {
    footer: {
      margin: 10,
      alignItems: "center",
    },
    container: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: "50%",
    },
    text: {
      fontFamily: "Futura",
      color: "#7a7a7a",
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
