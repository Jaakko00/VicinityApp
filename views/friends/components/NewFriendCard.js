import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  limit,
} from "firebase/firestore";
import moment from "moment";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";
import UserModal from "../../../components/UserModal/UserModal";

import Avatar from "../../../components/Avatar";

export default function NewFriendCard(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    card: {
      backgroundColor: theme.colors.lightBackground,
      padding: 10,

      minWidth: "100%",
      maxWidth: "100%",
    },
    cardHeader: {
      flexDirection: "row",
      overflow: "hidden",
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 2,
      borderColor: theme.colors.secondary,
      justifyContent: "space-evenly",
      flex: 1,
    },
    cardTextContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexGrow: 1,
    },

    shadowProp: {
      padding: 7,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    text: {
      fontFamily: "Futura",
      color: theme.colors.textSecondary,
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 16,
      color: theme.colors.text,
    },
    textMessage: {
      fontFamily: "Futura",
      color: theme.colors.textSecondary,
    },
    textMessageNew: {
      fontFamily: "Futura",
      color: theme.colors.text,
      fontWeight: "bold",
    },
  };

  const { user, setUser } = useContext(AuthenticatedUserContext);

  

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("UserProfile", {
            userProfile: props.friend,
          })
        }
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
      >
        <View>
          <View style={styles.cardHeader}>
            <Avatar
              style={styles.shadowProp}
              image={props.friend.avatar}
              width={70}
            />
            <View style={styles.cardTextContainer}>
              <View style={styles.cardHeaderText}>
                <Text style={styles.textHeader}>
                  {`${props.friend.firstName} ${props.friend.lastName}`}
                </Text>

                <Text style={styles.textMessage} numberOfLines={1}>
                  Do you want to be friends?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => props.addFriend(props.friend.connection_id)}
              >
                <MaterialCommunityIcons name="check" size={40} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.removeFriend(props.friend.connection_id)}
              >
                <MaterialCommunityIcons name="close" size={40} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
