import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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

import { AuthenticatedUserContext } from "../../../App";
import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";

export default function FriendCard(props) {
  const styles = {
    card: {
      backgroundColor: "#fff",
      padding: 10,
      margin: 10,
      borderRadius: 10,
      minWidth: "90%",
      maxWidth: "90%",

      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    cardHeader: {
      flexDirection: "row",
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 1,
      borderColor: "#E40066",
    },

    scrollView: {
      maxHeight: 200,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: "white",
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
    },
    textMessage: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
  };

  

  return (
    <View>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Chat", {friend: props.friend})}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <UserAvatar
              style={styles.shadowProp}
              width={70}
              image={props.friend.avatar}
              user={props.friend}
              navigation={props.navigation}
            />

            <View style={styles.cardHeaderText}>
              <Text style={styles.text}>
                {`${props.friend.firstName} ${props.friend.lastName}`}
              </Text>
              <Text style={styles.textMessage}>
                <MaterialCommunityIcons name="send" size={15} color="#E40066" />{" "}
                Moikka! Mitä kuuluu?
              </Text>
              <Text style={styles.text}>Some time ago</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
