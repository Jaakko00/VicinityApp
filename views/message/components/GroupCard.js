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
import GroupAvatar from "../../../components/GroupAvatar";
import PreviewImage from "../../home/components/PreviewImage";

export default function GroupCard(props) {
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
    textHeader: {
      fontFamily: "Futura",
      fontSize: 16,
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
    const latestMessageQuery = query(
      collection(firestore, `group/${props.group.id}`, "messages"),
      orderBy("sentAt", "desc"),
      limit(1)
    );
    const unSub = onSnapshot(latestMessageQuery, (querySnapshot) => {
      querySnapshot.docs.forEach((msg) => setLatestMessage(msg.data()));
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
          props.navigation.navigate("GroupChat", { group: props.group })
        }
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
      >
        <View>
          <View style={styles.cardHeader}>
            <GroupAvatar
              style={styles.shadowProp}
              width={70}
              image={props.group.avatar}
              navigation={props.navigation}
            />

            <View style={styles.cardHeaderText}>
              <View style={styles.cardFirstRow}>
                <Text style={styles.textHeader}>{`${props.group.name}`}</Text>
                {latestMessage && (
                  <Text style={styles.text}>
                    {moment(latestMessage.sentAt).isSame(new Date(), "day")
                      ? moment(latestMessage.sentAt).format("hh:mm")
                      : moment(latestMessage.sentAt).format("D.M.")}
                  </Text>
                )}
              </View>

              <Text style={styles.textMessage} numberOfLines={1}>
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
