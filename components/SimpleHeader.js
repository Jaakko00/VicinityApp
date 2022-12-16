import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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

export default function SimpleHeader(props) {
  const styles = {
    header: {
      zIndex: 999,
      backgroundColor: "#fff",
      width: "100%",
      height: "15%",
      shadowColor: "#171717",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      justifyContent: "flex-end",
    },

    avatar: {
      padding: 7,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },

    card: {
      margin: 10,
      justifyContent: "center",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderColor: "#E40066",
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
    <SafeAreaView style={styles.header}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => props.onClose()}>
            <Text>
              <MaterialCommunityIcons
                name="close"
                size={40}
                color="#276fbf"
                style={styles.sendIcon}
              />
            </Text>
          </TouchableOpacity>
          {props.title && <Text style={styles.textHeader}>{props.title}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}
