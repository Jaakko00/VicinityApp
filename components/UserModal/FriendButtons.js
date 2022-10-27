import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";

export default function FriendButtons(props) {
  const styles = {
    sendPostButton: {
      backgroundColor: "white",
      borderRadius: 10,
      height: 80,
      width: "45%",
      marginTop: 10,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    disabled: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.2,
    },
    mainContainer: {
      width: "90%",
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      position: "absolute",
      bottom: 40,
    },
  };

  let friendIcon;
  switch (props.friendStatus) {
    case "outpending":
      friendIcon = "account-clock";
      break;
    case "inpending":
      friendIcon = "account-question";
      break;
    case "approved":
      friendIcon = "account-remove";
      break;
    default:
      friendIcon = "account-plus";
      break;
  }

  return (
    <>
      {!props.disabled && (
        <View style={styles.mainContainer}>
          <View style={styles.sendPostButton}>
            <TouchableOpacity
              style={styles.container}
              onPress={props.addFriend}
            >
              <Text>
                <MaterialCommunityIcons
                  name={friendIcon}
                  size={50}
                  color="#E40066"
                />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sendPostButton}>
            <TouchableOpacity
              style={
                props.friendStatus === "approved"
                  ? styles.container
                  : styles.disabled
              }
              onPress={props.message}
              disabled={props.friendStatus !== "approved"}
            >
              <Text>
                <MaterialCommunityIcons name="chat" size={50} color="#E40066" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
