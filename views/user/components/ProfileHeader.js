import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { signOut } from "firebase/auth";
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
import { SafeAreaView, ThemeColors } from "react-navigation";
import { auth, firestore } from "../../../config/firebase";
import {AuthenticatedUserContext, ThemeContext } from "../../../App";

export default function ProfileHeader(props) {
  const { theme } = useContext(ThemeContext);
  const {unSubscribes, user, userInfo} = useContext(AuthenticatedUserContext);

  const styles = {
    header: {
      zIndex: 999,
      backgroundColor: theme.colors.background,
      width: "100%",
      height: "15%",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      justifyContent: "flex-end",
    },

    avatar: {
      padding: 7,
      shadowColor: theme.colors.shadow,
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
      color: theme.colors.secondary,
      fontSize: 18,
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 18,
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
  const onSignOut = () => {
    unSubscribes.forEach((unSubscribe) => unSubscribe());
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={40}
                color={theme.colors.secondary}
                style={styles.sendIcon}
              />
            </Text>
          </TouchableOpacity>
          {props.showSignOut && (
            <TouchableOpacity
              onPress={() => {
                onSignOut();
              }}
            >
              <Text style={styles.text}>Sign out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
