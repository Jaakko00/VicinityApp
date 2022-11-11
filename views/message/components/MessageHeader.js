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

import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";

export default function MessageHeader(props) {
  const styles = {
    header: {
      zIndex: 999,
      backgroundColor: "#fff",
      width: "100%",
      height: "15%",
    },
    logo: {
      width: "100%",
      height: "98%",
      resizeMode: "contain",
    },
    card: {
      margin: 10,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderColor: "#E40066",
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
    <View style={styles.header}>
      <SafeAreaView>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.textHeader}>Messages</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
