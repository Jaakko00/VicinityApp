import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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

import { firestore } from "../../../config/firebase";

import { AuthenticatedUserContext } from "../../../App";
import { ThemeContext } from "../../../App";
import Avatar from "../../../components/Avatar";
import UserAvatar from "../../../components/UserAvatar";
import PreviewImage from "../../home/components/PreviewImage";
import { ThemeColors } from "react-navigation";

export default function GroupTextBubbleReceived(props) {
  const [color, setColor] = useState("");
  const {theme} = useContext(ThemeContext);
  const styles = {
    bubbleContainer: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      margin: 10,
      marginBottom: 8,
      marginTop: 8,
    },
    bubble: {
      position: "relative",
      backgroundColor: "#fff",
      borderColor: color || theme.colors.primary,
      borderWidth: 2,
      padding: 15,

      borderRadius: 30,
      borderTopLeftRadius: 0,
      minWidth: "40%",
      maxWidth: "70%",

      shadowColor: color || theme.colors.primary,
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
      color: color || theme.colors.primary,
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

  const isDeleted = props.message.message === "Deleted";

  const getSender = async () => {
    const user = await getDoc(props.message.userRef);
    setSender(user.data());
  };

  useEffect(() => {
    getSender();
  }, [sender]);

  useEffect(() => {
    if (!color) {
      getColor();
    }
  }, []);

  const getColor = () => {
    props.group.participants.forEach((participant) => {
      if (participant.uid === props.message.uid) {
        setColor(participant.color);
      }
    });
  };

  return (
    <View>
      {/* {props.showReactions === props.message.id && (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={props.message.reaction === "👍" ? styles.iconSelected : ""}
              onPress={() => props.reactToMessage(props.message, "👍")}
            >
              <Text style={styles.icon}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={props.message.reaction === "😂" ? styles.iconSelected : ""}
              onPress={() => props.reactToMessage(props.message, "😂")}
            >
              <Text style={styles.icon}>😂</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={props.message.reaction === "👏" ? styles.iconSelected : ""}
              onPress={() => props.reactToMessage(props.message, "👏")}
            >
              <Text style={styles.icon}>👏</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={props.message.reaction === "😳" ? styles.iconSelected : ""}
              onPress={() => props.reactToMessage(props.message, "😳")}
            >
              <Text style={styles.icon}>😳</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={props.message.reaction === "😢" ? styles.iconSelected : ""}
              onPress={() => props.reactToMessage(props.message, "😢")}
            >
              <Text style={styles.icon}>😢</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      <View style={styles.bubbleContainer}>
        <Text style={styles.senderText}>
          {sender && sender.firstName} {sender && sender.lastName}
        </Text>
        <TouchableOpacity
          onLongPress={() => props.setShowReactions(props.message.id)}
          disabled
        >
          <View style={styles.bubble}>
            <View style={styles.cardHeader}>
              <View style={styles.bubbleText}>
                <Text style={!isDeleted ? styles.text : styles.textDeleted}>
                  {props.message.message}
                </Text>
                <Text style={styles.textSecondary}>
                  {moment(props.message.sentAt).format("hh:mm")}
                </Text>
              </View>
            </View>
            {/* {props.message.reaction && (
              <View style={styles.reactedView}>
                <Text style={styles.icon}>{props.message.reaction}</Text>
              </View>
            )} */}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
