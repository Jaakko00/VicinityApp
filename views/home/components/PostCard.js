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
} from "react-native";

import { AuthenticatedUserContext } from "../../../App";
import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "./PreviewImage";

export default function PostCard(props) {
  const styles = {
    card: {
      backgroundColor: "#fff",
      padding: 10,
      marginTop: 10,
      borderRadius: 10,
      minWidth: "95%",
      maxWidth: "95%",

      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    cardHeader: {
      flexDirection: "row",
    },
    cardHeaderText: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 2,
      borderColor: "#E40066",
      flex: 1,
    },
    cardHeaderTextOwn: {
      margin: 5,
      padding: 5,
      borderLeftWidth: 2,
      borderColor: "#276fbf",
      flex: 1,
    },
    cardFirstRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    scrollView: {
      maxHeight: 200,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      padding: 5,
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
      color: "#7a7a7a",
    },
    textPrimary: {
      fontFamily: "Futura",
      backgroundColor: "#fff",
      fontSize: 16,
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 16,
    },
  };

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <UserAvatar
          style={styles.shadowProp}
          width={55}
          image={props.post.userData.avatar}
          user={props.post.userData}
          navigation={props.navigation}
        />

        <View
          style={
            props.post.userData.uid !== user.uid
              ? styles.cardHeaderText
              : styles.cardHeaderTextOwn
          }
        >
          <View style={styles.cardFirstRow}>
            <Text style={styles.textHeader}>
              {props.post.userData.uid !== user.uid
                ? `${props.post.userData.firstName} ${props.post.userData.lastName}`
                : "You"}
            </Text>
            <Text style={styles.text}>Tampere, Amuri</Text>
          </View>
          <Text style={styles.text}>
            {moment(props.post.postedAt).fromNow()}
          </Text>
        </View>
      </View>
      <View style={styles.scrollView}>
        <ScrollView>
          <Text style={styles.textPrimary}>{props.post.text}</Text>
        </ScrollView>
      </View>
      {props.post.image && (
        <PreviewImage width="100%" height={80} image={props.post.image} />
      )}
    </View>
  );
}
