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

import { AuthenticatedUserContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";
import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";

export default function FriendCard(props) {
  const styles = {
    card: {
      backgroundColor: "#fff",
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
      borderColor: "#E40066",
      justifyContent: "space-evenly",
      flex: 1,
    },
    cardFirstRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    textNew: {
      fontFamily: "Futura",
      color: "#000",
      fontWeight: "bold",
    },
    textHeader: {
      fontFamily: "Futura",
      fontSize: 16,
    },
    textHeaderNew: {
      fontFamily: "Futura",
      fontSize: 16,
      fontWeight: "bold",
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

  const { user, setUser } = useContext(AuthenticatedUserContext);

  const [latestMessage, setLatestMessage] = useState();

  const getLatestMessage = async () => {
    const friendQuery1 = query(
      collection(firestore, "friends"),
      where("userRef", "==", doc(firestore, "user", user.uid)),
      where("friendRef", "==", doc(firestore, "user", props.friend.uid)),
      where("status", "==", "approved")
    );

    const friendQuery2 = query(
      collection(firestore, "friends"),
      where("friendRef", "==", doc(firestore, "user", user.uid)),
      where("userRef", "==", doc(firestore, "user", props.friend.uid)),
      where("status", "==", "approved")
    );

    const querySnapshot1 = await getDocs(friendQuery1);

    let unSub;
    querySnapshot1.forEach(async (friend) => {
      const latestMessageQuery = query(
        collection(firestore, `friends/${friend.id}`, "messages"),
        orderBy("sentAt", "desc"),
        limit(1)
      );
      unSub = onSnapshot(latestMessageQuery, (querySnapshot) => {
        querySnapshot.docs.forEach((msg) => setLatestMessage(msg.data()));
      });
    });

    const querySnapshot2 = await getDocs(friendQuery2);

    querySnapshot2.forEach(async (friend) => {
      const latestMessageQuery = query(
        collection(firestore, `friends/${friend.id}`, "messages"),
        orderBy("sentAt", "desc"),
        limit(1)
      );
      unSub = onSnapshot(latestMessageQuery, (querySnapshot) => {
        querySnapshot.docs.forEach((msg) => setLatestMessage(msg.data()));
      });
    });

    return () => unSub();
  };

  useEffect(() => {
    getLatestMessage();
  }, []);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("Chat", { friend: props.friend })
        }
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
      >
        <View>
          <View style={styles.cardHeader}>
            <UserAvatar
              style={styles.shadowProp}
              width={70}
              image={props.friend.avatar}
              user={props.friend}
              navigation={props.navigation}
            />

            <View style={styles.cardHeaderText}>
              <View style={styles.cardFirstRow}>
                <Text
                  style={
                    latestMessage
                      ? latestMessage.uid === user.uid || latestMessage.seen
                        ? styles.textHeader
                        : styles.textHeaderNew
                      : styles.textHeader
                  }
                >
                  {`${props.friend.firstName} ${props.friend.lastName}`}
                </Text>
                {latestMessage && (
                  <Text
                    style={
                      latestMessage
                        ? latestMessage.uid === user.uid || latestMessage.seen
                          ? styles.text
                          : styles.textNew
                        : styles.text
                    }
                  >
                    {moment(latestMessage.sentAt).fromNow()}
                  </Text>
                )}
              </View>

              <Text
                style={
                  latestMessage
                    ? latestMessage.uid === user.uid || latestMessage.seen
                      ? styles.textMessage
                      : styles.textMessageNew
                    : styles.textMessage
                }
                numberOfLines={1}
              >
                {latestMessage && !(latestMessage.uid !== user.uid) ? (
                  <MaterialCommunityIcons
                    name={
                      latestMessage
                        ? latestMessage.uid === user.uid
                          ? latestMessage.seen
                            ? "eye-check"
                            : "send-outline"
                          : latestMessage.seen
                          ? "account"
                          : "exclamation-thick"
                        : "chat-plus-outline"
                    }
                    size={16}
                    color="#276fbf"
                    style={styles.sendIcon}
                  />
                ) : (
                  ""
                )}{" "}
                {latestMessage
                  ? latestMessage.message
                  : "Start a conversation!"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
