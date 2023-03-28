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
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-navigation";

import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";
import { ThemeContext } from "../../../App";

export default function ChatHeader(props) {
  const { theme } = useContext(ThemeContext);
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
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 20,
      color: theme.colors.text,
    },
  };
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={40}
                color={theme.colors.secondary}
                style={styles.sendIcon}
              />
            </Text>
          </TouchableOpacity>
          <View style={styles.cardHeaderText}>
            <Text style={styles.textHeader}>
              {props.friend.firstName} {props.friend.lastName}
            </Text>
          </View>
          <UserAvatar
            style={styles.avatar}
            width={50}
            image={props.friend.avatar}
            user={props.friend}
            navigation={props.navigation}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
