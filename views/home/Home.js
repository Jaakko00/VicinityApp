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
  updateDoc,
  setDoc,
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

import HomeHeader from "../../components/HomeHeader";
import { auth, firestore } from "../../config/firebase";
import getDistance from "../../utils/getDistance";
import UserView from "../user/User";
import UserProfileView from "../user/UserProfile";
import ChatView from "../chat/Chat";
import HomeEmpty from "./components/HomeEmpty";
import HomeFooter from "./components/HomeFooter";
import PostCard from "./components/PostCard";
import { AuthenticatedUserContext, ThemeContext } from "../../App";

const Stack = createStackNavigator();

export function HomeView({ navigation, route }) {
  const [files, setFiles] = useState([]);
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, userInfo } = useContext(AuthenticatedUserContext);
  const { theme } = useContext(ThemeContext);

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

  const updatePost = async (post_id, params) => {
    const postRef = doc(firestore, "post", post_id);
    await updateDoc(postRef, params);
  };

  useEffect(() => {
    if (!posts.length) {
      getPosts();
    }
  }, []);

  useEffect(() => {
    const tempNearbyPosts = [];
    if (userInfo) {
      posts.forEach((post, index) => {
        if (post.location) {
          const distance = getDistance(
            userInfo.location.latitude,
            userInfo.location.longitude,
            post.location.latitude,
            post.location.longitude
          );
          post = { ...post, distance };
          if (distance <= 0.5) {
            tempNearbyPosts.push(post);
          }
        }
      });
    }
    setNearbyPosts(tempNearbyPosts);
  }, [posts]);

  const styles = {
    homeBackgroundContainer: {
      position: "absolute",
      bottom: 0,
      opacity: 0.2,
      height: "40%",
      width: "100%",
      transform: [{ scaleX: 2 }],
      borderTopStartRadius: 280,
      borderTopEndRadius: 180,
      overflow: "hidden",
      alignItems: "center",
    },
    homeBackground: {
      flex: 1,
      width: "100%",
      transform: [{ scaleX: 0.5 }],
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    view: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 10,
    },
    emptyView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontWeight: "bold",
      fontSize: 18,
      marginTop: 0,
    },
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPosts().then(() => setRefreshing(false));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.homeBackgroundContainer}>
        <View style={styles.homeBackground} />
      </View>
      <HomeHeader navigation={navigation} getPosts={getPosts} />
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={nearbyPosts.sort(function (a, b) {
          const c = new Date(a.postedAt);
          const d = new Date(b.postedAt);
          return d - c;
        })}
        renderItem={({ item }) => (
          <View style={styles.view}>
            <PostCard
              key={item.id}
              post={item}
              navigation={navigation}
              updatePost={updatePost}
            />
          </View>
        )}
        ListFooterComponent={
          nearbyPosts.length ? (
            <View style={styles.view}>
              <HomeFooter />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <HomeEmpty />
          </View>
        }
        ListFooterComponentStyle={{ marginTop: 10 }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default function MessageStack({ navigation, route }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Posts" component={HomeView} />
      <Stack.Screen name="User" component={UserView} />
      <Stack.Screen name="UserProfileHome" component={UserProfileView} />
      <Stack.Screen name="ChatHome" component={ChatView} />
    </Stack.Navigator>
  );
}
