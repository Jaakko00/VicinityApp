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
  addDoc,
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
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import { SafeAreaView, ThemeColors } from "react-navigation";
import StoryAvatar from "../../components/StoryAvatar";
import getTime from "../../utils/getTime";

import { AuthenticatedUserContext, ThemeContext } from "../../App";
import MessageHeader from "./components/MessageHeader";
import { auth, firestore } from "../../config/firebase";
import ChatView from "../chat/Chat";
import GroupChatView from "../chat/GroupChat";
import UserProfileView from "../user/UserProfile";
import FriendsView from "../friends/Friends";
import NewGroupModal from "./components/NewGroupModal";
import MessageCard from "./components/MessageCard";
import GroupCard from "./components/GroupCard";
const Stack = createStackNavigator();

export function MessageView({ navigation, route }) {
  const storage = getStorage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const { user, userInfo, approvedFriends, newMessages } = useContext(
    AuthenticatedUserContext
  );
  const { theme } = useContext(ThemeContext);

  const [groups, setGroups] = useState([]);

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

  const updateGroups = () => {
    setGroups([]);
    getGroups();
  };

  const leaveGroup = async (groupId) => {
    const groupDoc = doc(firestore, "group", groupId);
    const group = await getDoc(groupDoc);
    const groupData = group.data();

    let newUsers = groupData.users.filter((u) => u !== user.uid);

    await updateDoc(groupDoc, {
      users: newUsers,
    });
    const groupMessagesRef = collection(firestore, `group/${groupId}/messages`);
    await addDoc(groupMessagesRef, {
      message: `${userInfo.firstName} left the group`,
      sentAt: Date.now(),
      type: "info",
    });

    updateGroups();
  };

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
      color: theme.colors.text,
    },
    headerIcon: {
      padding: 5,
      paddingRight: 10,
      fontFamily: "Futura",
      color: theme.colors.text,
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

      backgroundColor: theme.colors.lightBackground,
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
    modalView: {
      height: "100%",
      backgroundColor: "#E40066",
      padding: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    topBar: {
      backgroundColor: "white",
      width: "50%",
      height: 5,
      borderRadius: "50%",
      marginBottom: 10,
    },
    modalItem: {
      backgroundColor: "white",
      margin: 10,
      padding: 5,
      width: "90%",
      borderRadius: 10,
    },
    modalText: {
      padding: 5,
      paddingLeft: 10,
      fontFamily: "Futura",
      fontSize: 18,
    },
    modalButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
    },
    modalButtonText: {
      color: "white",
      fontFamily: "Futura",
      fontSize: 18,
    },
    textInput: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      fontSize: 18,
      fontFamily: "Futura",
    },
    homeBackgroundContainer: {
      position: "absolute",
      bottom: 0,
      opacity: 0.2,
      height: "40%",
      width: "100%",
      transform: [{ scaleX: 2 }],
      borderTopStartRadius: 180,
      borderTopEndRadius: 280,
      overflow: "hidden",
      alignItems: "center",
    },
    homeBackground: {
      flex: 1,
      width: "100%",
      transform: [{ scaleX: 0.5 }],
      backgroundColor: theme.colors.secondary,
      alignItems: "center",
      justifyContent: "flex-end",
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.lightBackground }}>
      <View style={styles.homeBackgroundContainer}>
        <View style={styles.homeBackground} />
      </View>
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
            <Text style={styles.header}>Your group</Text>
            <TouchableOpacity onPress={() => setGroupModalVisible(true)}>
              <MaterialCommunityIcons
                style={styles.headerIcon}
                name="plus"
                size={35}
                color={theme.colors.text}
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
              <GroupCard
                key={group.id}
                group={group}
                navigation={navigation}
                leaveGroup={leaveGroup}
              />
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
      <NewGroupModal
        groupModalVisible={groupModalVisible}
        setGroupModalVisible={setGroupModalVisible}
        updateGroups={updateGroups}
        groups={groups}
      />
    </View>
  );
}

export default function MessageStack({ navigation, route }) {
  return (
    <Stack.Navigator
      initialRouteName="Messages"
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
      <Stack.Screen name="UserProfile" component={UserProfileView} />
    </Stack.Navigator>
  );
}
