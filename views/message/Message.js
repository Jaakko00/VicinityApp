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
import ChatView from "../chat/Chat";
import AddPostButton from "../home/components/AddPostButton";
import FriendCard from "./components/FriendCard";
const Stack = createStackNavigator();

export function MessageView({ navigation, route }) {
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);

  const [friends, setFriends] = useState([]);

  // Create a reference under which you want to list
  const listRef = ref(storage, "images/");

  // Find all the prefixes and items.

  const getPosts = async () => {
    setPosts([]);
    setLoading(true);

    const querySnapshot = await getDocs(collection(firestore, "post"));
    querySnapshot.forEach(async (post) => {
      const tempPost = post.data();
      tempPost.id = post.id;
      if (tempPost.userRef) {
        const userQuery = await getDoc(tempPost.userRef);
        tempPost.userData = userQuery.data();
      }
      setPosts((oldPosts) => [...oldPosts, tempPost]);
    });

    setLoading(false);
  };

  const getFriends = async () => {
    let friendRefs = [];
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

  useEffect(() => {
    getFriends();
  }, []);

  const styles = {
    view: {
      backgroundColor: "#F2D7D9",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    text: {
      fontWeight: "bold",
      fontSize: 18,
      marginTop: 0,
    },
    scrollView: {},
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPosts().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.view}>
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Messages"
        component={MessageView}
        navigation={navigation}
      />
      <Stack.Screen name="Chat" component={ChatView} />
    </Stack.Navigator>
  );
}
