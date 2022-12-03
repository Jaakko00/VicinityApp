import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-navigation";

import Avatar from "./Avatar";
import PreviewImage from "../views/home/components/PreviewImage";
import { AuthenticatedUserContext } from "../App";

import AddPostButton from "../views/home/components/AddPostButton";

export default function HomeHeader(props) {
  const { user, userInfo } = useContext(AuthenticatedUserContext);
  const styles = {
    header: {
      zIndex: 999,
      backgroundColor: "#fff",
      width: "100%",
      height: "15%",
      justifyContent: "flex-end",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: "100%",
    },
    logo: {
      maxWidth: "40%",
      height: "50%",
      resizeMode: "contain",
      margin: 10,
    },
    accountIcon: {
      width: 80,
      margin: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  };
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/Vicinity-text-transparent.png")}
        />
        <View style={styles.accountIcon}>
          <AddPostButton getPosts={props.getPosts} />
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("UserProfileHome", {
                userProfile: userInfo,
              })
            }
          >
            <Text>
              <MaterialCommunityIcons name="account" size={35} color="#000" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
