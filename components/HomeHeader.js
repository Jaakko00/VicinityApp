import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-navigation";

import Avatar from "./Avatar";
import PreviewImage from "../views/home/components/PreviewImage";

export default function HomeHeader(props) {
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
    },

    shadowProp: {
      padding: 7,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    logo: {
      width: "100%",
      height: "98%",
      resizeMode: "contain",
    },
  };
  return (
    <View style={styles.header}>
      <SafeAreaView>
        <View>
          <Image
            style={styles.logo}
            source={require("../assets/Vicinity-text-transparent.png")}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
