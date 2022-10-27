import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { AuthenticatedUserContext } from "../../../App";
import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";

export default function TextBubbleReceived(props) {
  const styles = {
    bubbleContainer: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      width: "90%",
      maxHeight: "15%",
      minHeight: "15%",
      marginBottom: 10,
      marginTop: 10,
    },
    bubble: {
      backgroundColor: "#fff",
      padding: 15,

      borderRadius: 30,
      borderTopLeftRadius: 0,
      minWidth: "40%",
      maxWidth: "70%",

      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    cardHeader: {
      flexDirection: "row",
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 1,
      borderColor: "#E40066",
    },

    scrollView: {
      maxHeight: 200,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: "white",
    },
    shadowProp: {
      padding: 7,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    text: {
      fontFamily: "Futura",
      fontSize: 16,
    },
    textSecondary: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
  };

  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.bubble}>
        <View style={styles.cardHeader}>
          <View style={styles.bubbleText}>
            <Text style={styles.text}>{props.message.message}</Text>
            <Text style={styles.textSecondary}>
              {moment(props.message.sentAt).format("hh:mm")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
