import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Audio } from "expo-av";
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
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  SectionList,
} from "react-native";
import getTime from "../../utils/getTime";

import { AuthenticatedUserContext } from "../../App";
import { auth, firestore } from "../../config/firebase";
import InfoMessage from "./components/InfoMessage";
import DateSection from "./components/DateSection";

import GroupHeader from "./components/GroupHeader";
import InputField from "./components/InputField";

import GroupTextBubbleReceived from "./components/GroupTextBubbleReceived";
import GroupTextBubbleSent from "./components/GroupTextBubbleSent";
import moment from "moment";

const Stack = createStackNavigator();

export default function GroupChatView(props, { route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const [stateFriend, setStateFriend] = useState("");
  const [approvedAt, setApprovedAt] = useState("");
  const { group } = props.route.params;
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [showReactions, setShowReactions] = useState("");
  const [showDelete, setShowDelete] = useState("");

  const getMessages = async () => {
    const latestMessageQuery = query(
      collection(firestore, `group/${group.id}`, "messages")
    );
    const unSub = onSnapshot(latestMessageQuery, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((msg) => {
          return { ...msg.data(), id: msg.id };
        })
      );
    });

    return () => unSub();
  };

  const sendNewMessage = async (newMessage) => {
    if (newMessage) {
      await addDoc(collection(firestore, `group/${group.id}/messages`), {
        message: newMessage,
        seenBy: [],
        sentAt: Date.now(),
        userRef: doc(firestore, "user", user.uid),
        uid: user.uid,
        type: "message",
      });
    }
  };

  const reactToMessage = async (message, emoji) => {
    setShowReactions("");
    if (emoji === message.reaction) {
      emoji = null;
    } else {
      playReactionSound();
    }
    if (message) {
      console.log("Reacting");
      await updateDoc(
        doc(firestore, `group/${group.id}/messages`, message.id),
        {
          reaction: emoji,
        }
      );
    }
  };

  const deleteMessage = async (message) => {
    setShowDelete("");
    playDeleteSound();
    if (message) {
      console.log("Deleting");
      await updateDoc(
        doc(firestore, `group/${group.id}/messages`, message.id),
        {
          message: "Deleted",
          reaction: null,
        }
      );
    }
  };

  const setMessagesAsSeen = async () => {
    const notSeen = messages.filter((msg) => {
      return msg.seenBy && !msg.seenBy.includes(user.uid);
    });

    notSeen.forEach(async (message) => {
      console.log("Updating messages as seen");
      await updateDoc(
        doc(firestore, `group/${group.id}/messages/`, message.id),
        {
          seenBy: message.seenBy.concat(user.uid),
        }
      );
    });
  };

  const playReactionSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/popSound.mp3")
    );

    console.log("Playing Sound");
    await sound.playAsync();
  };

  const playDeleteSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/delete.mp3")
    );

    console.log("Playing Sound");
    await sound.playAsync();
  };

  useEffect(() => {
    if (!messages.length) {
      getMessages();
    }
  }, []);

  const sortMessagesToDates = () => {
    const tempSortedMessages = [];
    messages
      .sort(function (a, b) {
        const c = new Date(a.sentAt);
        const d = new Date(b.sentAt);
        return d - c;
      })
      .forEach((message) => {
        let foundDate = false;
        tempSortedMessages.forEach((sort) => {
          if (moment(sort.date).isSame(moment(message.sentAt), "day")) {
            console.log("pvm löytyi");
            foundDate = true;
            sort.data.push(message);
          }
        });
        if (!foundDate) {
          console.log("pvm ei löytynyt");
          tempSortedMessages.push({
            date: message.sentAt,
            data: [message],
          });
        }
      });
    console.log("sortedMessages", tempSortedMessages);
    setSortedMessages(tempSortedMessages);
  };

  useEffect(() => {
    if (messages) {
      setMessagesAsSeen();
      sortMessagesToDates();
    }
  }, [messages]);

  const styles = {};

  const onPressOutside = () => {
    setShowReactions("");
    setShowDelete("");
  };

  return (
    <>
      <GroupHeader group={group} navigation={props.navigation} />
      <TouchableWithoutFeedback
        onPress={onPressOutside}
        disabled={!showReactions && !showDelete}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SectionList
            sections={sortedMessages}
            keyExtractor={(item, index) => item + index}
            renderItem={(msg) => {
              if (!msg.item.uid) {
                return (
                  <InfoMessage
                    message={msg.item}
                    secondaryMessage={msg.item.sentAt}
                  />
                );
              } else if (msg.item.uid !== user.uid) {
                return (
                  <GroupTextBubbleReceived
                    key={msg.item.id}
                    group={group}
                    message={msg.item}
                    showReactions={showReactions}
                    setShowReactions={setShowReactions}
                    reactToMessage={reactToMessage}
                  />
                );
              } else {
                return (
                  <GroupTextBubbleSent
                    key={msg.item.id}
                    group={group}
                    message={msg.item}
                    showDelete={showDelete}
                    setShowDelete={setShowDelete}
                    deleteMessage={deleteMessage}
                  />
                );
              }
            }}
            renderSectionFooter={({ section: { date } }) => (
              <DateSection date={date} />
            )}
            inverted
          />

          {/* <FlatList
            data={messages.sort(function (a, b) {
              const c = new Date(a.sentAt);
              const d = new Date(b.sentAt);
              return d - c;
            })}
            ListFooterComponent={<View style={{ margin: 5 }} />}
            ListHeaderComponent={<View style={{ margin: 5 }} />}
            renderItem={(msg, index) => {
              if (!msg.item.uid) {
                return (
                  <InfoMessage
                    message={msg.item}
                    secondaryMessage={msg.item.sentAt}
                  />
                );
              } else if (msg.item.uid !== user.uid) {
                return (
                  <GroupTextBubbleReceived
                    key={msg.item.id}
                    group={group}
                    message={msg.item}
                    showReactions={showReactions}
                    setShowReactions={setShowReactions}
                    reactToMessage={reactToMessage}
                  />
                );
              } else {
                return (
                  <GroupTextBubbleSent
                    key={msg.item.id}
                    group={group}
                    message={msg.item}
                    showDelete={showDelete}
                    setShowDelete={setShowDelete}
                    deleteMessage={deleteMessage}
                  />
                );
              }
            }}
            inverted
          /> */}
          <InputField sendNewMessage={sendNewMessage} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}
