import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  onSnapshot,
  updateDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  SafeAreaView,
} from "react-native";
import moment from "moment";
import uuid from "react-native-uuid";

import GroupAddAvatar from "../../components/GroupAddAvatar";
import CommentHeader from "./components/CommentHeader";
import DateSection from "../chat/components/DateSection";
import CommentBubble from "./components/CommentBubble";
import CommentBubbleSent from "./components/CommentBubbleSent";

import { AuthenticatedUserContext, ThemeContext } from "../../App";
import { auth, firestore } from "../../config/firebase";

export default function CommentModal(props) {
  const { theme } = useContext(ThemeContext);

  const { user, userInfo, approvedFriends, newMessages } = useContext(
    AuthenticatedUserContext
  );
  const [sortedComments, setSortedComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const styles = {
    modalView: {
      height: "100%",
      backgroundColor: "white",
      padding: theme.size.paddingBig,
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
    topBar: {
      backgroundColor: "black",
      width: "50%",
      height: 5,
      borderRadius: "50%",
      marginBottom: 10,
    },
    commentsContainer: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.9)",
    },
    modalItem: {
      backgroundColor: "white",
      margin: 10,
      padding: theme.size.paddingSmall,
      width: "90%",
      borderRadius: theme.size.borderRadius,
    },
    inputContainer: {
      backgroundColor: "#fff",
    },
    flexContainer: {
      flexDirection: "row",
      borderWidth: 2,
      borderRadius: 10,
      margin: 5,
      borderColor: "#000",
      alignItems: "flex-end",
    },
    textInput: {
      padding: 10,
      paddingLeft: 20,
      paddingTop: 10,
      fontFamily: "Futura",
      width: "80%",
    },

    sendButton: {
      paddingTop: 10,
      paddingBottom: 10,
      padding: 10,
      fontFamily: "Futura",
      flexGrow: 1,

      marginLeft: 0,
      height: 38,
      borderColor: "#276fbf",
    },
    sendIcon: {
      textAlign: "center",
    },
  };

  const sortMessagesToDates = () => {
    const tempSortedMessages = [];
    props.comments
      .sort(function (a, b) {
        const c = new Date(a.sentAt);
        const d = new Date(b.sentAt);
        return d - c;
      })
      .forEach((message) => {
        let foundDate = false;
        tempSortedMessages.forEach((sort) => {
          if (moment(sort.date).isSame(moment(message.sentAt), "day")) {
            foundDate = true;
            sort.data.push(message);
          }
        });
        if (!foundDate) {
          tempSortedMessages.push({
            date: message.sentAt,
            data: [message],
          });
        }
      });

    setSortedComments(tempSortedMessages);
  };

  useEffect(() => {
    if (props.comments) {
      sortMessagesToDates();
    }
  }, [props.comments]);

  const handleSend = async () => {
    if (newComment.length > 0) {
      props.handleComment(newComment);

      setNewComment("");
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={props.commentModalOpen}
      onRequestClose={() => {
        props.setCommentModalOpen(false);
      }}
      presentationStyle="overFullScreen"
      transparent
    >
      <CommentHeader setCommentModalOpen={props.setCommentModalOpen} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.commentsContainer}>
          <FlatList
            data={props.comments}
            keyExtractor={(item, index) => item.id}
            renderItem={(msg) => {
              if (msg.item.uid !== user.uid) {
                return (
                  <CommentBubble
                    comment={msg.item}
                    navigation={props.navigation}
                    setCommentModalOpen={props.setCommentModalOpen}
                  />
                );
              } else {
                return <CommentBubbleSent comment={msg.item} />;
              }
            }}
            ListHeaderComponent={<View style={{ margin: 5 }} />}
            ListFooterComponent={<View style={{ margin: 5 }} />}
            inverted
          />
          <View style={styles.inputContainer}>
            <View style={styles.flexContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="New comment"
                value={newComment}
                onChangeText={(text) => setNewComment(text)}
                multiline
                maxLength={120}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => handleSend()}
                disabled={newComment.length === 0}
              >
                <Text>
                  <MaterialCommunityIcons
                    name="send"
                    size={19}
                    color="#276fbf"
                    style={styles.sendIcon}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
