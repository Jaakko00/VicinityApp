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
} from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-navigation";

import { AuthenticatedUserContext } from "../../App";
import HomeHeader from "../../components/HomeHeader";
import { auth, firestore } from "../../config/firebase";
import InputField from "./components/InputField";
import TextBubbleReceived from "./components/TextBubbleReceived";
import TextBubbleSent from "./components/TextBubbleSent";
const Stack = createStackNavigator();

export default function ChatView(props, { route, navigation }) {
  const [files, setFiles] = useState([]);
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState([]);

  const { friend } = props.route.params;

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);

  // const getMessages = async (friend) => {
  //   const friendQuery1 = query(
  //     collection(firestore, "friends"),
  //     where("userRef", "==", doc(firestore, "user", user.uid)),
  //     where("status", "==", "approved")
  //   );

  //   const querySnapshot1 = await getDocs(friendQuery1);

  //   querySnapshot1.forEach((friend) => {
  //     friendRefs.push(friend.data().friendRef);
  //   });

  //   friendRefs.forEach((ref) => {
  //     getDoc(ref).then((result) =>
  //       setFriends((oldArray) => [...oldArray, result.data()])
  //     );
  //   });
  // };

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

    querySnapshot1.forEach(async (friend) => {
      const messages = await getDocs(
        collection(firestore, `friends/${friend.id}`, "messages")
      );
      messages.forEach((msg) => {
        setMessages((oldArray) => [...oldArray, msg.data()]);
      });
    });

    const querySnapshot2 = await getDocs(friendQuery2);

    querySnapshot2.forEach(async (friend) => {
      const messages = await getDocs(
        collection(firestore, `friends/${friend.id}`, "messages")
      );
      messages.forEach((msg) => {
        setMessages((oldArray) => [...oldArray, msg.data()]);
      });
    });
  };

  useEffect(() => {
    if (!messages.length) {
      getMessages();
    }
  }, []);

  // Create a reference under which you want to list
  const listRef = ref(storage, "images/");

  // Find all the prefixes and items.

  const styles = {
    view: {
      backgroundColor: "#F2D7D9",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    text: {
      fontWeight: "bold",
      fontSize: 18,
      marginTop: 0,
    },
    scrollView: {},
  };

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => console.log("Refreshing")}
          />
        }
      >
        <View style={styles.view}>
          {messages
            .sort(function (a, b) {
              const c = new Date(a.sentAt);
              const d = new Date(b.sentAt);
              return c - d;
            })
            .map((msg) => {
              if (msg.uid !== user.uid) {
                return <TextBubbleReceived key={msg.id} message={msg} />;
              } else {
                return <TextBubbleSent key={msg.id} message={msg} />;
              }
            })}
        </View>
      </ScrollView>
      <InputField />
    </View>
  );
}
