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
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import StoryAvatar from "../../components/StoryAvatar";
import getTime from "../../utils/getTime";

import { AuthenticatedUserContext } from "../../App";
import MessageHeader from "./components/MessageHeader";
import { auth, firestore } from "../../config/firebase";
import ChatView from "../chat/Chat";
import GroupChatView from "../chat/GroupChat";
import AddPostButton from "../home/components/AddPostButton";
import FriendCard from "./components/FriendCard";
import GroupCard from "./components/GroupCard";
const Stack = createStackNavigator();

export function MessageView({ navigation, route }) {
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);

  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);

  // Create a reference under which you want to list
  const listRef = ref(storage, "images/");

  const getFriends = async () => {
    const friendRefs = [];
    const friendQuery1 = query(
      collection(firestore, "friends"),
      where("userRef", "==", doc(firestore, "user", user.uid)),
      where("status", "==", "approved")
    );

    const friendQuery2 = query(
      collection(firestore, "friends"),
      where("friendRef", "==", doc(firestore, "user", user.uid)),
      where("status", "==", "approved")
    );

    const querySnapshot1 = await getDocs(friendQuery1);

    querySnapshot1.forEach((friend) => {
      friendRefs.push(friend.data().friendRef);
    });

    const querySnapshot2 = await getDocs(friendQuery2);

    querySnapshot2.forEach((friend) => {
      friendRefs.push(friend.data().userRef);
    });

    friendRefs.forEach((ref) => {
      getDoc(ref).then((result) =>
        setFriends((oldArray) => [...oldArray, result.data()])
      );
    });
  };

  const getGroups = async () => {
    const groupQuery = query(
      collection(firestore, "group"),
      where("users", "array-contains", user.uid)
    );

    const querySnapshot = await getDocs(groupQuery);

    querySnapshot.forEach((group) => {
      setGroups((oldGroups) => [
        ...oldGroups,
        { ...group.data(), id: group.id },
      ]);
    });
  };

  useEffect(() => {
    if (!friends.length) {
      getFriends();
    }
    if (!groups.length) {
      getGroups();
    }
  }, []);

  const styles = {
    view: {
      backgroundColor: "#fff",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-center",
    },
    horizontalView: {
      backgroundColor: "#fff",
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    text: {
      margin: 5,
      fontFamily: "Futura",
    },
    header: {
      padding: 5,
      paddingLeft: 10,
      fontFamily: "Futura",
      fontSize: 18,
      backgroundColor: "#fff",
    },
    messagesView: { flexGrow: 1, flex: 1 },
    scrollViewHorizontal: { height: 150 },
    userAvatar: {
      margin: 10,
      alignItems: "center",
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <MessageHeader />
      <ScrollView>
        <View style={styles.scrollViewHorizontal}>
          <Text style={styles.header}>Stories</Text>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} horizontal>
            <View style={styles.horizontalView}>
              {friends.map((frn) => {
                return (
                  <View key={frn.uid} style={styles.userAvatar}>
                    <StoryAvatar
                      width={70}
                      image={frn.avatar}
                      user={frn}
                      navigation={navigation}
                    />
                    <Text style={styles.text}>{frn.firstName}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View style={styles.messagesView}>
          <Text style={styles.header}>Groups</Text>

          {groups.map((group) => {
            return (
              <GroupCard key={group.id} group={group} navigation={navigation} />
            );
          })}
        </View>
        <View style={styles.messagesView}>
          <Text style={styles.header}>Messages</Text>

          {friends.map((frn) => {
            return (
              <FriendCard key={frn.uid} friend={frn} navigation={navigation} />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default function MessageStack({ navigation, route }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Stack.Screen
        name="Messages"
        component={MessageView}
        navigation={navigation}
      />
      <Stack.Screen name="Chat" component={ChatView} />
      <Stack.Screen name="GroupChat" component={GroupChatView} />
    </Stack.Navigator>
  );
}
