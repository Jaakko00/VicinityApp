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
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  SectionList,
} from "react-native";

import { AuthenticatedUserContext } from "../../App";
import { auth, firestore } from "../../config/firebase";
import FriendsHeader from "./components/FriendsHeader";
import FriendCard from "./components/FriendCard";
import NewFriendCard from "./components/NewFriendCard";
import PendingFriendCard from "./components/PendingFriendCard";

const Stack = createStackNavigator();

export default function FriendsView({ route, navigation }) {
  const storage = getStorage();
  const [refreshing, setRefreshing] = useState(false);

  const {
    user,
    setUser,
    inpendingFriends,
    outpendingFriends,
    approvedFriends,
  } = useContext(AuthenticatedUserContext);

  const [sortedFriends, setSortedFriends] = useState([]);

  const addFriend = async (connection_id) => {
    console.log("Approving friend");
    await updateDoc(doc(firestore, "friends", connection_id), {
      status: "approved",
      approvedAt: Date.now(),
    });
    await addDoc(collection(firestore, "friends", connection_id, "messages"), {
      message: "You are now friends!",
      sentAt: Date.now(),
      type: "info",
      seen: true,
    });
  };

  const removeFriend = async (connection_id) => {
    console.log("Removing friend");
    await deleteDoc(doc(firestore, "friends", connection_id));
  };

  useEffect(() => {
    setSortedFriends([
      {
        title: "New Friends",
        data: inpendingFriends,
      },
      {
        title: "Friends",
        data: approvedFriends,
      },
      {
        title: "Pending",
        data: outpendingFriends,
      },
    ]);
  }, [inpendingFriends, outpendingFriends, approvedFriends]);

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
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <FriendsHeader navigation={navigation} />

      {approvedFriends.length > 0 ||
      inpendingFriends.length > 0 ||
      outpendingFriends.length > 0 ? (
        <SectionList
          sections={sortedFriends}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => {
            if (section.title === "New Friends") {
              return (
                <NewFriendCard
                  friend={item}
                  navigation={navigation}
                  addFriend={addFriend}
                  removeFriend={removeFriend}
                />
              );
            } else if (section.title === "Friends") {
              return (
                <FriendCard
                  friend={item}
                  navigation={navigation}
                  addFriend={addFriend}
                  removeFriend={removeFriend}
                />
              );
            } else if (section.title === "Pending") {
              return (
                <PendingFriendCard
                  friend={item}
                  navigation={navigation}
                  addFriend={addFriend}
                  removeFriend={removeFriend}
                />
              );
            }
          }}
          renderSectionHeader={({ section }) => {
            if (section.data.length > 0) {
              return <Text style={styles.header}>{section.title}</Text>;
            }
          }}
          ListHeaderComponent={<View style={{ margin: 5 }} />}
          ListFooterComponent={<View style={{ margin: 5 }} />}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.header}>No friends yet 🤠</Text>
        </View>
      )}
    </View>
  );
}
