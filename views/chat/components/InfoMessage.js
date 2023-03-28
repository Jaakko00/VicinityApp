import { MaterialCommunityIcons } from "@expo/vector-icons";

import moment from "moment";
import React, {useContext} from "react";

import { Text, View } from "react-native";
import getTime from "../../../utils/getTime";
import { ThemeContext } from "../../../App";

export default function InfoMessage(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    footer: {
      margin: 10,
      alignItems: "center",
    },

    text: {
      fontFamily: "Futura",
      color: theme.colors.textSecondary,
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
