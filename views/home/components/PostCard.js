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
  };

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <UserAvatar
          style={styles.shadowProp}
          width={70}
          image={props.post.userData.avatar}
          user={props.post.userData}
          navigation={props.navigation}
        />

        <View style={styles.cardHeaderText}>
          <Text style={styles.text}>
            {props.post.userData.uid !== user.uid
              ? `${props.post.userData.firstName} ${props.post.userData.lastName} posted`
              : "You posted"}
          </Text>
          <Text style={styles.text}>
            {moment(props.post.postedAt).fromNow()}
          </Text>
          <Text style={styles.text}>300m away</Text>
        </View>
      </View>
      <View style={styles.scrollView}>
        <ScrollView>
          <Text style={styles.text}>{props.post.text}</Text>
        </ScrollView>
      </View>
      {props.post.image && (
        <PreviewImage width="100%" height={80} image={props.post.image} />
      )}
    </View>
  );
}
