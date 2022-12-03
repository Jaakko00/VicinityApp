import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";

import { firestore } from "../../config/firebase";
import { AuthenticatedUserContext, ThemeContext } from "../../App";

import Avatar from "../Avatar";
import FriendButtons from "./FriendButtons";

export default function UserModal(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    modalView: {
      height: "100%",
      backgroundColor: "white",
    },
    topView: {
      height: "30%",
      backgroundColor: "#E40066",
      paddingTop: 10,
      alignItems: "center",
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "space-between",
    },
    topContainer: {
      alignItems: "center",
    },
    nameTextContainer: {
      backgroundColor: "white",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      padding: theme.size.paddingBig,
    },
    nameText: {
      fontSize: 24,
      color: "black",
      fontFamily: "Futura",
    },
    bottomView: {
      height: "70%",
      backgroundColor: "white",
      padding: 10,
      alignItems: "center",
    },

    topBar: {
      backgroundColor: "#121212",
      width: "50%",
      height: 5,
      borderRadius: "50%",
      marginBottom: 10,
    },
    modalImage: {
      width: "100%",
      minHeight: "50%",
      borderRadius: 10,
    },

    shadowProp: {
      padding: 7,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
  };
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userInfo, setUserInfo } = useContext(AuthenticatedUserContext);

  const [otherUser, setOtherUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const [friendStatus, setFriendStatus] = useState("");
  const [friendConnection, setFriendConnection] = useState();

  const addFriend = async () => {
    if (!friendStatus) {
      console.log("Adding friend");
      await addDoc(collection(firestore, "friends"), {
        userRef: doc(firestore, "user", user.uid),
        friendRef: doc(firestore, "user", props.user.uid),
        status: "pending",
      });
      setFriendStatus("outpending");
    } else if (friendStatus === "inpending") {
      console.log("Approving friend");
      await updateDoc(doc(firestore, "friends", friendConnection.id), {
        status: "approved",
        approvedAt: Date.now(),
      });
      await addDoc(
        collection(firestore, "friends", friendConnection.id, "messages"),
        {
          message: "You are now friends!",
          sentAt: Date.now(),
          type: "info",
          seen: true,
        }
      );
      setFriendStatus("approved");
    } else if (friendStatus === "approved" || friendStatus === "outpending") {
      console.log("Removing friend");
      await deleteDoc(doc(firestore, "friends", friendConnection.id));
      setFriendStatus("");
    }
  };

  const getFriend = async () => {
    const querySnapshot = await getDoc(doc(firestore, `user`, props.user.uid));
    setOtherUser(querySnapshot.data());
  };

  const getFriendStatus = async () => {
    const friendQuery1 = query(
      collection(firestore, "friends"),
      where("userRef", "==", doc(firestore, "user", user.uid)),
      where("friendRef", "==", doc(firestore, "user", props.user.uid))
    );

    const friendQuery2 = query(
      collection(firestore, "friends"),
      where("friendRef", "==", doc(firestore, "user", user.uid)),
      where("userRef", "==", doc(firestore, "user", props.user.uid))
    );

    const querySnapshot1 = await getDocs(friendQuery1);

    querySnapshot1.forEach((friend) => {
      //console.log("You sent this friend request", friend.id);
      setFriendConnection(friend);
      if (friend.data().status === "pending") {
        setFriendStatus("outpending");
      } else if (friend.data().status === "approved") {
        setFriendStatus("approved");
      } else if (friend.data().status === "rejected") {
        setFriendStatus("rejected");
      }
    });

    if (!friendStatus) {
      const querySnapshot2 = await getDocs(friendQuery2);

      querySnapshot2.forEach((friend) => {
        //console.log("He sent this friend request", friend.id);
        setFriendConnection(friend);
        if (friend.data().status === "pending") {
          setFriendStatus("inpending");
        } else if (friend.data().status === "approved") {
          setFriendStatus("approved");
        } else if (friend.data().status === "rejected") {
          setFriendStatus("rejected");
        }
      });
    }
  };

  useEffect(() => {
    if (props.open && !friendStatus) {
      getFriendStatus();
    }
  });

  const messageFriend = () => {
    props.navigation.navigate("Chat", { friend: props.user });
    props.onClose();
  };

  return (
    <Modal
      animationType="slide"
      visible={props.open}
      onRequestClose={() => props.onClose()}
      presentationStyle="pageSheet"
    >
      <View style={styles.modalView}>
        <View style={styles.topView}>
          <Pressable
            style={styles.topBar}
            onPress={() => setModalVisible(!modalVisible)}
          />
          <View style={styles.topContainer}>
            <Avatar style={styles.shadowProp} width={100} image={props.image} />
            <View style={styles.nameTextContainer}>
              <Text style={styles.nameText}>
                {props.user.firstName} {props.user.lastName}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomView}></View>
      </View>
    </Modal>
  );
}
