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
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, ThemeColors } from "react-navigation";
import StoryAvatar from "../../components/StoryAvatar";
import getTime from "../../utils/getTime";

import { AuthenticatedUserContext, ThemeContext } from "../../App";
import MessageHeader from "./components/MessageHeader";
import { auth, firestore } from "../../config/firebase";
import ChatView from "../chat/Chat";
import GroupChatView from "../chat/GroupChat";
import FriendsView from "../friends/Friends";
import AddPostButton from "../home/components/AddPostButton";
import MessageCard from "./components/MessageCard";
import GroupCard from "./components/GroupCard";
const Stack = createStackNavigator();

export function MessageView({ navigation, route }) {
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { user, approvedFriends, newMessages } = useContext(
    AuthenticatedUserContext
  );
  const { theme } = useContext(ThemeContext);

  const [groups, setGroups] = useState([]);

  // Create a reference under which you want to list
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
    headerIcon: {
      padding: 5,
      paddingRight: 10,
      fontFamily: "Futura",
    },
    headerContainer: {
      flexGrow: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    placeholderText: {
      padding: 5,
      fontFamily: "Futura",

      backgroundColor: "#fff",
      color: theme.colors.textSecondary,
    },
    messagesView: { flexGrow: 1, flex: 1 },
    scrollViewHorizontal: { height: 150 },
    userAvatar: {
      margin: 10,
      alignItems: "center",
    },
    empty: {
      alignItems: "center",
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <MessageHeader navigation={navigation} />
      <ScrollView>
        {/* <View style={styles.scrollViewHorizontal}>
          <Text style={styles.header}>Stories</Text>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} horizontal>
            <View style={styles.horizontalView}>
              {approvedFriends.map((frn) => {
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
        </View> */}
        <View style={styles.messagesView}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Groups</Text>
            <TouchableOpacity
              onPress={() => console.log("Open group creation modal")}
            >
              <MaterialCommunityIcons
                style={styles.headerIcon}
                name="plus"
                size={35}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          {groups.length < 1 && (
            <View style={styles.empty}>
              <Text style={styles.placeholderText}>Add or join a group</Text>
            </View>
          )}
          {groups.map((group) => {
            return (
              <GroupCard key={group.id} group={group} navigation={navigation} />
            );
          })}
        </View>
        <View style={styles.messagesView}>
          <Text style={styles.header}>Messages</Text>
          {approvedFriends.length < 1 && (
            <View style={styles.empty}>
              <Text style={styles.placeholderText}>
                Add friends from your neighbourhood
              </Text>
            </View>
          )}

          {approvedFriends.map((frn) => {
            return (
              <MessageCard key={frn.uid} friend={frn} navigation={navigation} />
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
      <Stack.Screen name="Friends" component={FriendsView} />
    </Stack.Navigator>
  );
}
