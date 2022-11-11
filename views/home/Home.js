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
import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-navigation";

import AddPostButton from "./components/AddPostButton";
import HomeHeader from "../../components/HomeHeader";
import PostCard from "./components/PostCard";
import { auth, firestore } from "../../config/firebase";

import UserView from "../user/User";

const Stack = createStackNavigator();

export function HomeView({ navigation }) {
  const [files, setFiles] = useState([]);
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    getPosts();
  }, []);
  useEffect(() => {}, [posts]);

  // useEffect(() => {
  //   const tempList = [];
  //   let itemsProcessed = 0;
  //   listAll(listRef)
  //     .then((res) => {
  //       res.items
  //         .forEach((itemRef) => {
  //           getDownloadURL(ref(storage, itemRef._location.path_))
  //             .then((url) => {
  //               itemsProcessed++;
  //               tempList.push(url);
  //               if (itemsProcessed === res.items.length) {
  //                 setFiles(tempList);
  //               }
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         })
  //         .then(() => console.log("Done"));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const styles = {
    view: {
      backgroundColor: "#f0f0f0",
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
      <HomeHeader navigation={navigation} getPosts={getPosts} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.view}>
          {posts
            .sort(function (a, b) {
              var c = new Date(a.postedAt);
              var d = new Date(b.postedAt);
              return d - c;
            })
            .map((post) => {
              return (
                <PostCard key={post.id} post={post} navigation={navigation} />
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
      <Stack.Screen name="Posts" component={HomeView} navigation={navigation} />
      <Stack.Screen name="User" component={UserView} />
    </Stack.Navigator>
  );
}
