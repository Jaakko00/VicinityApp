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

import { AuthenticatedUserContext } from "../../App";
import MessageHeader from "./components/MessageHeader";
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

  useEffect(() => {
    getFriends();
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
    scrollView: { flexGrow: 1, flex: 1 },
    scrollViewHorizontal: { height: 150 },
    userAvatar: {
      margin: 10,
      alignItems: "center",
    },
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPosts().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <MessageHeader />

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
      <View style={styles.scrollView}>
        <Text style={styles.header}>Messages</Text>

        <FlatList
          data={friends}
          renderItem={(frn) => (
            <FriendCard
              key={frn.item.uid}
              friend={frn.item}
              navigation={navigation}
            />
          )}
        />
      </View>
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
    </Stack.Navigator>
  );
}
