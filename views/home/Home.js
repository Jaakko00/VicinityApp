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
  deleteDoc,
  startAt,
  endAt,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
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
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-navigation";

import { AuthenticatedUserContext, ThemeContext } from "../../App";
import HomeHeader from "../../components/HomeHeader";
import { auth, firestore } from "../../config/firebase";
import ChatView from "../chat/Chat";
import UserView from "../user/User";
import UserProfileView from "../user/UserProfile";
import HomeEmpty from "./components/HomeEmpty";
import HomeFooter from "./components/HomeFooter";
import PostCard from "./components/PostCard";
import PinnedHeader from "./components/HomeSectionTitle";

const Stack = createStackNavigator();

export function HomeView({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postSections, setPostSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, userInfo } = useContext(AuthenticatedUserContext);
  const { theme } = useContext(ThemeContext);

  const getPosts = async () => {
    if (userInfo && userInfo.location) {
      setLoading(true);
      console.log("Getting posts");
      const tempPosts = [];
      const radiusInM = 3 * 1000;

      const center = [userInfo.location.latitude, userInfo.location.longitude];
      console.log("center", center);

      const bounds = geohashQueryBounds(center, radiusInM);

      console.log("bounds", bounds);

      const promises = [];
      for (const b of bounds) {
        const q = query(
          collection(firestore, "post"),
          orderBy("hash"),
          startAt(b[0]),
          endAt(b[1])
        );
        promises.push(getDocs(q));
      }

      Promise.all(promises)
        .then((snapshots) => {
          const matchingDocs = [];

          for (const snap of snapshots) {
            for (const doc of snap.docs) {
              const lat = doc.get("location").latitude;
              const lng = doc.get("location").longitude;

              // We have to filter out a few false positives due to GeoHash
              // accuracy, but most will match
              const distanceInKm = distanceBetween([lat, lng], center);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                matchingDocs.push(doc);
              }
            }
          }

          return matchingDocs;
        })
        .then(async (matchingDocs) => {
          // Get the user data and distance between your and post location for each post and add it to the post object
          for (const post of matchingDocs) {
            const tempPost = post.data();
            tempPost.id = post.id;
            if (tempPost.userRef) {
              const userQuery = await getDoc(tempPost.userRef);
              tempPost.userData = userQuery.data();
              tempPost.distance = distanceBetween(
                [tempPost.location.latitude, tempPost.location.longitude],
                center
              ).toPrecision(2);
            }
            tempPosts.push(tempPost);
          }
        })
        .then(() => {
          setPosts(tempPosts);
          setLoading(false);
        });
    }
  };

  const updatePost = async (post_id, params) => {
    const postRef = doc(firestore, "post", post_id);
    await updateDoc(postRef, params);
  };

  const deletePost = async (post_id) => {
    const postRef = doc(firestore, "post", post_id);
    await deleteDoc(postRef);
    // find the post in the posts array and remove it
    const newPosts = posts.filter((post) => post.id !== post_id);
    setPosts(newPosts);
  };

  useEffect(() => {
    if (!posts.length) {
      getPosts();
    }
  }, [userInfo]);

  useEffect(() => {
    const now = Date.now();
    const pinnedPosts = posts.filter(
      (post) => post.pinned && now - post.postedAt < 86400000
    );
    const tempSections = [
      {
        data: pinnedPosts.sort(function (a, b) {
          const c = new Date(a.postedAt);
          const d = new Date(b.postedAt);
          return d - c;
        }),
        title: "Pinned",
      },
      {
        data: posts
          .filter((post) => !post.pinned || now - post.postedAt > 86400000)
          .sort(function (a, b) {
            const c = new Date(a.postedAt);
            const d = new Date(b.postedAt);
            return d - c;
          }),
        title: "Posts",
      },
    ];
    setPostSections(tempSections);
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
    <View style={{ flex: 1, backgroundColor: theme.colors.lightBackground }}>
      <View style={styles.homeBackgroundContainer}>
        <View style={styles.homeBackground} />
      </View>
      <HomeHeader navigation={navigation} getPosts={getPosts} />
      <SectionList
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        sections={postSections}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <View style={styles.view}>
            <PostCard
              key={item.id}
              post={item}
              navigation={navigation}
              updatePost={updatePost}
              deletePost={deletePost}
            />
          </View>
        )}
        ListFooterComponent={
          posts.length ? (
            <View style={styles.view}>
              <HomeFooter />
            </View>
          ) : null
        }
        
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <HomeEmpty loading={loading} />
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
