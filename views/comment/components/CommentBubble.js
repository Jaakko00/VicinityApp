import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import { firestore } from "../../../config/firebase";
import UserAvatar from "../../../components/UserAvatar";

export default function CommentBubble(props) {
  const [color, setColor] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = {
    bubbleContainer: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      margin: 10,
      marginBottom: 8,
      marginTop: 8,
    },
    bubbleContentContainer: {
      flexDirection: "row",
      maxWidth: "80%",
    },
    bubbleAvatar: {
      marginRight: 10,
    },
    bubble: {
      position: "relative",
      backgroundColor: "#fff",
      borderColor: "#000",
      borderWidth: 2,
      padding: 15,

      borderRadius: 10,
      borderTopLeftRadius: 0,
      minWidth: "40%",
      maxWidth: "100%",

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
      fontSize: 16,
    },
    senderText: {
      fontFamily: "Futura",
      fontSize: 16,
      color: "#000",
    },
    textDeleted: {
      fontFamily: "Futura",
      fontSize: 16,
      color: "#7a7a7a",
      fontStyle: "italic",
    },
    textSecondary: {
      fontFamily: "Futura",
      color: "#7a7a7a",
    },
    icon: {
      fontSize: 20,
      margin: 5,
    },
    iconSelected: {
      backgroundColor: "#fff",
      borderRadius: "50%",
      borderWidth: 2,
      borderColor: "#276fbf",
    },
    centeredView: {
      position: "absolute",
      zIndex: 99,
      left: "40%",
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    reactedView: {
      position: "absolute",
      zIndex: 99,
      right: -15,
      bottom: -15,
      backgroundColor: "#fff",
      borderRadius: "50%",
      borderWidth: 2,
      borderColor: "#276fbf",
    },
  };

  const [sender, setSender] = useState();

  const getSender = async () => {
    const docRef = doc(firestore, "user", props.comment.uid);
    const user = await getDoc(docRef);
    setSender(user.data());
  };

  useEffect(() => {
    getSender();
  }, []);

  return (
    <View>
      <View style={styles.bubbleContainer}>
        <Text style={styles.senderText}>
          {sender && sender.firstName} {sender && sender.lastName}
        </Text>
        <View style={styles.bubbleContentContainer}>
          <View style={styles.bubbleAvatar}>
            <UserAvatar
              width={40}
              image={sender?.avatar}
              user={sender}
              navigation={props.navigation}
              home
              callback={() => props.setCommentModalOpen(false)}
            />
          </View>

          <TouchableOpacity>
            <View style={styles.bubble}>
              <View style={styles.cardHeader}>
                <View style={styles.bubbleText}>
                  <Text style={styles.text}>{props.comment.message}</Text>
                  <Text style={styles.textSecondary}>
                    {moment(props.comment.sentAt).fromNow()}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
