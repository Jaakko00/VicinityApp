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

export default function RegisterButton(props) {
  const styles = {
    mainContainer: {
      flex: 1,
      alignItems: "center",
      margin: 20,
      marginBottom: 40,
    },
    sendPostButton: {
      borderRadius: 10,
      height: 80,
      width: "100%",
      backgroundColor: "#E40066",
    },
    sendPostButtonDisabled: {
      borderRadius: 10,
      height: 80,
      width: "100%",
      backgroundColor: "#E40066",
      opacity: 0.2,
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
    text: {
      fontSize: 36,
      textAlign: "center",
      fontFamily: "Futura",
      color: "#fff",
    },
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View
          style={
            props.disabled
              ? styles.sendPostButtonDisabled
              : styles.sendPostButton
          }
        >
          <TouchableOpacity
            style={props.disabled ? styles.disabled : styles.container}
            onPress={
              props.disabled ? () => console.log("Disabled") : props.onPress
            }
          >
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
