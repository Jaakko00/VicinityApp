import { MaterialCommunityIcons } from "@expo/vector-icons";

import moment from "moment";
import * as React from "react";

import { Text, View } from "react-native";
import getTime from "../../../utils/getTime";

export default function InfoMessage(props) {
  const styles = {
    footer: {
      margin: 10,
      alignItems: "center",
    },

    text: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 20,
    },
    textMessage: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
    textMessageNew: {
      fontFamily: "Futura",
      color: "#000",
      fontWeight: "bold",
    },
  };
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        {props.message.sentAt && moment(props.message.sentAt).format("hh:mm")}
      </Text>
      <Text style={styles.text}>{props.message.message}</Text>
    </View>
  );
}
