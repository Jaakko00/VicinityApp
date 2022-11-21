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
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
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

import { AuthenticatedUserContext } from "../../App";
import { auth, firestore } from "../../config/firebase";
import ChatHeader from "./components/ChatHeader";
import DateSection from "./components/DateSection";
import InfoMessage from "./components/InfoMessage";
import InputField from "./components/InputField";
import TextBubbleReceived from "./components/TextBubbleReceived";
import TextBubbleSent from "./components/TextBubbleSent";

const Stack = createStackNavigator();

export default function ChatView(props, { route, navigation }) {
  const storage = getStorage();
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const [stateFriend, setStateFriend] = useState("");

  const [approvedAt, setApprovedAt] = useState("");
  const { friend } = props.route.params;
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [showReactions, setShowReactions] = useState("");
  const [showDelete, setShowDelete] = useState("");

  const getMessages = async () => {
    const friendQuery1 = query(
      collection(firestore, "friends"),
      where("userRef", "==", doc(firestore, "user", user.uid)),
      where("friendRef", "==", doc(firestore, "user", friend.uid)),
      where("status", "==", "approved")
    );

    const friendQuery2 = query(
      collection(firestore, "friends"),
      where("friendRef", "==", doc(firestore, "user", user.uid)),
      where("userRef", "==", doc(firestore, "user", friend.uid)),
      where("status", "==", "approved")
    );

    const querySnapshot1 = await getDocs(friendQuery1);

    let unSub;
    querySnapshot1.forEach(async (friend) => {
      setStateFriend(friend.id);
      setApprovedAt(friend.data().approvedAt);

      unSub = onSnapshot(
        collection(firestore, `friends/${friend.id}`, "messages"),
        (querySnapshot) => {
          const loaded = false;
          setMessages(
            querySnapshot.docs.map((msg) => ({ ...msg.data(), id: msg.id }))
          );
        }
      );
    });

    const querySnapshot2 = await getDocs(friendQuery2);

    querySnapshot2.forEach(async (friend) => {
      setStateFriend(friend.id);
      setApprovedAt(friend.data().approvedAt);

      unSub = onSnapshot(
        collection(firestore, `friends/${friend.id}`, "messages"),
        (querySnapshot) => {
          setMessages(
            querySnapshot.docs.map((msg) => {
              return { ...msg.data(), id: msg.id };
            })
          );
        }
      );
    });

    return () => unSub();
  };

  const sendNewMessage = async (newMessage) => {
    if (newMessage && stateFriend) {
      await addDoc(collection(firestore, `friends/${stateFriend}/messages`), {
        message: newMessage,
        seen: false,
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
        doc(firestore, `friends/${stateFriend}/messages`, message.id),
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
        doc(firestore, `friends/${stateFriend}/messages`, message.id),
        {
          message: "Deleted",
          reaction: null,
        }
      );
    }
  };

  const setMessagesAsSeen = async () => {
    const notSeen = messages.filter((msg) => {
      return !msg.seen && msg.uid !== user.uid;
    });

    notSeen.forEach(async (message) => {
      await updateDoc(
        doc(firestore, `friends/${stateFriend}/messages/`, message.id),
        {
          seen: true,
        }
      );
    });
  };

  const playReactionSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/popSound.mp3")
    );

    await sound.playAsync();
  };

  const playDeleteSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/delete.mp3")
    );

    await sound.playAsync();
  };

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

    setSortedMessages(tempSortedMessages);
  };

  useEffect(() => {
    if (!messages.length) {
      getMessages();
    }
  }, []);

  useEffect(() => {
    if (stateFriend) {
      setMessagesAsSeen();
    }
    if (messages) {
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
      <ChatHeader friend={friend} navigation={props.navigation} />
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
                  <TextBubbleReceived
                    key={msg.item.id}
                    message={msg.item}
                    showReactions={showReactions}
                    setShowReactions={setShowReactions}
                    reactToMessage={reactToMessage}
                  />
                );
              } else {
                return (
                  <TextBubbleSent
                    key={msg.item.id}
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
            ListHeaderComponent={<View style={{ margin: 5 }} />}
            ListFooterComponent={<View style={{ margin: 5 }} />}
            inverted
          />

          <InputField sendNewMessage={sendNewMessage} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}
