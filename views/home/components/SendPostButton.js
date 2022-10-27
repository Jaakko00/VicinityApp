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

export default function SendPostButton(props) {
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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sendPostButton}>
        <TouchableOpacity
          style={!props.loading ? styles.container : styles.disabled}
          onPress={props.onClose}
          disabled={props.loading}
        >
          <Text>
            <MaterialCommunityIcons name="close" size={50} color="#E40066" />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sendPostButton}>
        <TouchableOpacity
          style={
            props.postText.length && !props.loading
              ? styles.container
              : styles.disabled
          }
          onPress={props.onSave}
          disabled={!props.postText.length || props.loading}
        >
          <Text>
            <MaterialCommunityIcons name="send" size={50} color="#E40066" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
