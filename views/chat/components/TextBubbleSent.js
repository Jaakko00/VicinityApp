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

export default function TextBubbleSent(props) {
  const styles = {
    bubbleContainer: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
      margin: 10,
      marginBottom: 8,
      marginTop: 8,
    },
    bubble: {
      backgroundColor: "#fff",
      borderColor: "#276fbf",
      borderWidth: 2,
      padding: 15,

      borderRadius: 30,
      borderBottomRightRadius: 0,
      minWidth: "40%",
      maxWidth: "70%",

      shadowColor: "#276fbf",
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
    textDeleted: {
      fontFamily: "Futura",
      fontSize: 16,
      color: "#7a7a7a",
      fontStyle: "italic",
    },
    textSecondary: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
    icon: {
      fontSize: 20,
      margin: 5,
    },
    centeredView: {
      position: "absolute",
      zIndex: 99,
      left: -80,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    reactedView: {
      position: "absolute",
      zIndex: 2,
      left: -15,
      bottom: -15,
      backgroundColor: "#fff",
      borderRadius: "50%",
      borderWidth: 2,
      borderColor: "#E40066",
    },
  };
  const isToday = moment(props.message.sentAt).isSame(new Date(), "day");

  const isDeleted = props.message.message === "Deleted";

  return (
    <View>
      <View style={styles.bubbleContainer}>
        <TouchableOpacity
          onLongPress={() => props.setShowDelete(props.message.id)}
          disabled={isDeleted}
        >
          <View style={styles.bubble}>
            <View style={styles.cardHeader}>
              <View style={styles.bubbleText}>
                <Text style={!isDeleted ? styles.text : styles.textDeleted}>
                  {props.message.message}
                </Text>
                <Text style={styles.textSecondary}>
                  {isToday
                    ? moment(props.message.sentAt).format("hh:mm")
                    : moment(props.message.sentAt).format("D.M. hh:mm")}{" "}
                  {props.message.seen ? (
                    <MaterialCommunityIcons
                      name="eye-check"
                      size={16}
                      color="#276fbf"
                      style={styles.sendIcon}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="send-outline"
                      size={16}
                      color="#276fbf"
                      style={styles.sendIcon}
                    />
                  )}
                </Text>
              </View>
            </View>
            {props.showDelete === props.message.id && (
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    onPress={() => props.deleteMessage(props.message)}
                  >
                    <Text style={styles.icon}>
                      <MaterialCommunityIcons
                        name="delete"
                        size={16}
                        color="red"
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {props.message.reaction && (
              <View style={styles.reactedView}>
                <Text style={styles.icon}>{props.message.reaction}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
