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
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";

import { AuthenticatedUserContext } from "../../App";
import { auth, firestore } from "../../config/firebase";
import ChatFooter from "./components/ChatFooter";
import ChatHeader from "./components/ChatHeader";
import InputField from "./components/InputField";
import TextBubbleReceived from "./components/TextBubbleReceived";
import TextBubbleSent from "./components/TextBubbleSent";

const Stack = createStackNavigator();

export default function ChatView(props, { route, navigation }) {
  const storage = getStorage();
  const [messages, setMessages] = useState([]);
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
    if (newMessage) {
      console.log("Sending it actually", stateFriend);
      await addDoc(collection(firestore, `friends/${stateFriend}/messages`), {
        message: newMessage,
        seen: false,
        sentAt: Date.now(),
        userRef: doc(firestore, "user", user.uid),
        uid: user.uid,
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
    const notSeenQuery = query(
      collection(firestore, `friends/${stateFriend}/messages`),
      where("uid", "!=", user.uid),
      where("seen", "==", false)
    );

    const querySnapshot = await getDocs(notSeenQuery);

    querySnapshot.forEach(async (message) => {
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

  useEffect(() => {
    if (stateFriend) {
      setMessagesAsSeen();
    }
  }, [stateFriend]);

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
          <FlatList
            data={messages.sort(function (a, b) {
              const c = new Date(a.sentAt);
              const d = new Date(b.sentAt);
              return d - c;
            })}
            ListFooterComponent={<ChatFooter approvedAt={approvedAt} />}
            ListHeaderComponent={<View style={{ margin: 5 }} />}
            renderItem={(msg) =>
              msg.item.uid !== user.uid ? (
                <TextBubbleReceived
                  key={msg.item.id}
                  message={msg.item}
                  showReactions={showReactions}
                  setShowReactions={setShowReactions}
                  reactToMessage={reactToMessage}
                />
              ) : (
                <TextBubbleSent
                  key={msg.item.id}
                  message={msg.item}
                  showDelete={showDelete}
                  setShowDelete={setShowDelete}
                  deleteMessage={deleteMessage}
                />
              )
            }
            inverted
          />
          <InputField sendNewMessage={sendNewMessage} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}
