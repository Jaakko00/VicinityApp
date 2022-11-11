import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-navigation";

import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";

export default function ChatFooter(props) {
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
        {props.approvedAt && moment(props.approvedAt).format("D.M.Y")}
      </Text>
      <Text style={styles.text}>You became friends!</Text>
    </View>
  );
}
