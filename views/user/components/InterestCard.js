import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Button,
  Share,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";

export default function InterestCard(props) {
  const { theme } = useContext(ThemeContext);

  const styles = {
    container: { height: "100%", backgroundColor: "white" },
    milestoneCard: {
      justifyContent: "flex-start",
      alignItems: "center",
      height: "50%",
      aspectRatio: 1,
      backgroundColor: "white",
      borderRadius: 10,
      margin: 10,
      padding: 10,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    milestoneIcon: {
      margin: 10,
    },
    milestoneTextContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    milestoneHeaderText: {
      margin: 5,
      fontSize: 18,
      color: theme.colors.primary,
      fontFamily: "Futura",
    },
    milestoneText: {
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.text,
      fontFamily: "Futura",
    },
    milestoneHeaderTextAdd: {
      margin: 5,
      fontSize: 18,
      color: theme.colors.textSecondary,
      fontFamily: "Futura",
    },
    milestoneTextAdd: {
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.textSecondary,
      fontFamily: "Futura",
    },
  };

  return (
    <>
      {props.variant === "add" ? (
        <TouchableOpacity style={styles.milestoneCard}>
          <View style={styles.milestoneIcon}>
            <MaterialCommunityIcons
              name={props.iconName}
              size={50}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.milestoneTextContainer}>
            <Text style={styles.milestoneHeaderTextAdd}>{props.title}</Text>
            <Text style={styles.milestoneTextAdd}>{props.children}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneIcon}>
            <MaterialCommunityIcons
              name={props.iconName}
              size={50}
              color="black"
            />
          </View>
          <View style={styles.milestoneTextContainer}>
            <Text style={styles.milestoneHeaderText}>{props.title}</Text>
            <Text style={styles.milestoneText}>{props.children}</Text>
          </View>
        </View>
      )}
    </>
  );
}
