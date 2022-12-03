import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Button,
  Share,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../App";
import Avatar from "../../components/Avatar";
import EditAvatar from "../../components/EditAvatar";
import { auth, firestore } from "../../config/firebase";
import InterestCard from "./components/InterestCard";
import ProfileHeader from "./components/ProfileHeader";

export default function UserProfileView({ navigation, route }) {
  const { user, inpendingFriends, outpendingFriends, approvedFriends } =
    useContext(AuthenticatedUserContext);
  const { theme } = useContext(ThemeContext);
  const { userProfile, home } = route.params;

  const [buttonText, setButtonText] = useState("Add friend");
  const [buttonIcon, setButtonIcon] = useState("account-plus");
  const [buttonColor, setButtonColor] = useState(theme.colors.secondary);
  const [messageColor, setMessageColor] = useState(theme.colors.textSecondary);

  const [friendStatus, setFriendStatus] = useState("");
  const [friendConnection, setFriendConnection] = useState();

  // Send friend request
  const sendFriendRequest = async () => {
    console.log("Adding friend");
    await addDoc(collection(firestore, "friends"), {
      userRef: doc(firestore, "user", user.uid),
      friendRef: doc(firestore, "user", userProfile.uid),
      status: "pending",
    });
    setFriendStatus("outpending");
  };

  // Approve friend request
  const approveFriendRequest = async () => {
    console.log("Approving friend");
    await updateDoc(doc(firestore, "friends", friendConnection), {
      status: "approved",
      approvedAt: Date.now(),
    });
    await addDoc(
      collection(firestore, "friends", friendConnection, "messages"),
      {
        message: "You are now friends!",
        sentAt: Date.now(),
        type: "info",
        seen: true,
      }
    );
    setFriendStatus("approved");
  };

  /* 
    Delete friend request
    Used when cancelling a friend request or deleting a friend
  */
  const removeFriend = async () => {
    console.log("Removing friend");
    await deleteDoc(doc(firestore, "friends", friendConnection));
    setFriendStatus(null);
  };

  // Handle friend button, depending on friend status
  const handleFriendButton = async () => {
    if (!friendStatus) {
      sendFriendRequest();
    } else if (friendStatus === "inpending") {
      approveFriendRequest();
    } else if (friendStatus === "approved" || friendStatus === "outpending") {
      removeFriend();
    }
  };

  useEffect(() => {
    if (userProfile) {
      getFriendStatus();
    }
  }, [userProfile, inpendingFriends, outpendingFriends, approvedFriends]);

  // Get friend status (inpending, outpending, approved, null)
  const getFriendStatus = () => {
    let tempStatus = null;
    if (inpendingFriends) {
      inpendingFriends.forEach((friend) => {
        if (friend.uid === userProfile.uid) {
          setFriendConnection(friend.connection_id);
          tempStatus = "inpending";
        }
      });
    }
    if (outpendingFriends) {
      outpendingFriends.forEach((friend) => {
        if (friend.uid === userProfile.uid) {
          setFriendConnection(friend.connection_id);
          tempStatus = "outpending";
        }
      });
    }
    if (approvedFriends) {
      approvedFriends.forEach((friend) => {
        if (friend.uid === userProfile.uid) {
          setFriendConnection(friend.connection_id);
          tempStatus = "approved";
        }
      });
    }
    if (tempStatus === null) {
      setFriendStatus(null);
    } else {
      setFriendStatus(tempStatus);
    }
  };

  // Set button text, icon and color depending on friend status
  useEffect(() => {
    switch (friendStatus) {
      case "approved":
        setButtonText("Remove friend");
        setButtonIcon("account-remove");
        setButtonColor(theme.colors.textSecondary);
        setMessageColor(theme.colors.secondary);
        break;
      case "outpending":
        setButtonText("Cancel request");
        setButtonIcon("account-cancel");
        setButtonColor(theme.colors.textSecondary);
        break;
      case "inpending":
        setButtonText("Approve friend");
        setButtonIcon("account-check");
        setButtonColor(theme.colors.primary);
        break;
      default:
        setButtonText("Add friend");
        setButtonIcon("account-plus");
        setButtonColor(theme.colors.secondary);
        break;
    }
  }, [friendStatus]);

  // Message friend
  const messageFriend = () => {
    if (friendStatus === "approved") {
      if (home) {
        navigation.navigate("ChatHome", {
          friend: userProfile,
        });
      } else {
        navigation.navigate("Chat", {
          friend: userProfile,
        });
      }
    }
  };

  const styles = {
    container: { height: "100%", backgroundColor: "white" },
    topViewContainer: {
      height: "50%",
      width: "100%",
      transform: [{ scaleX: 2 }],
      borderBottomStartRadius: 180,
      borderBottomEndRadius: 280,
      overflow: "hidden",
      alignItems: "center",
    },
    topView: {
      flex: 1,
      width: "100%",
      transform: [{ scaleX: 0.5 }],
      backgroundColor: theme.colors.secondary,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    avatarContainer: {
      marginTop: 20,
    },
    nameText: {
      fontSize: 30,
      color: "white",
      fontFamily: "Futura",
      margin: theme.size.margin,
    },
    infoTextContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      margin: theme.size.margin,
    },
    infoText: {
      fontSize: 14,
      color: "white",
      fontFamily: "Futura",
    },
    friendButtonsContainer: {
      flexDirection: "row",
    },
    friendButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: theme.size.paddingBig,
      margin: theme.size.margin,
      width: 150,
    },
    friendButtonDisabled: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: theme.size.paddingBig,
      margin: theme.size.margin,
      width: 150,
      opacity: 0.2,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: theme.size.paddingBig,
      margin: theme.size.margin,
      width: 300,
    },
    messageButtonText: {
      fontSize: 14,
      color: messageColor,
      fontFamily: "Futura",
    },
    addFriendButtonText: {
      fontSize: 14,
      color: buttonColor,
      fontFamily: "Futura",
    },
    editButtonText: {
      fontSize: 14,
      color: theme.colors.secondary,
      fontFamily: "Futura",
    },
    bottomView: {
      flex: 1,
      backgroundColor: "white",
    },
    bottomScroll: {
      marginTop: 10,
      alignItems: "flex-start",
    },
    milestoneCard: {
      justifyContent: "space-between",
      alignItems: "center",
      height: "50%",
      aspectRatio: 1,
      backgroundColor: "white",
      borderRadius: 10,
      margin: 10,
      padding: 10,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    milestoneIcon: {
      margin: 10,
    },
    milestoneHeaderText: {
      fontSize: 18,
      color: theme.colors.primary,
      fontFamily: "Futura",
    },
    milestoneText: {
      fontSize: 14,
      color: theme.colors.text,
      fontFamily: "Futura",
    },
  };

  return (
    <>
      <ProfileHeader
        navigation={navigation}
        showSignOut={user.uid === userProfile.uid}
      />
      <View style={styles.container}>
        <View style={styles.topViewContainer}>
          <View style={styles.topView}>
            <View style={styles.avatarContainer}>
              {user.uid !== userProfile.uid ? (
                <Avatar
                  style={styles.shadowProp}
                  width={140}
                  image={userProfile.avatar}
                />
              ) : (
                <EditAvatar
                  width={140}
                  userInfo={userProfile}
                  loading={false}
                />
              )}
            </View>
            <Text style={styles.nameText}>
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>{userProfile.city}</Text>
              <Text style={styles.infoText}>
                Joined {userProfile.createdAt || "02.12.22"}
              </Text>
              <Text style={styles.infoText}>42 friends</Text>
            </View>
            <View style={styles.friendButtonsContainer}>
              {user.uid !== userProfile.uid ? (
                <>
                  <TouchableOpacity
                    style={styles.friendButton}
                    onPress={handleFriendButton}
                  >
                    <MaterialCommunityIcons
                      name={buttonIcon}
                      size={24}
                      color={buttonColor}
                    />
                    <Text style={styles.addFriendButtonText}>{buttonText}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      friendStatus !== "approved"
                        ? styles.friendButtonDisabled
                        : styles.friendButton
                    }
                    onPress={messageFriend}
                    disabled={friendStatus !== "approved"}
                  >
                    <Text style={styles.messageButtonText}>Message</Text>
                    <MaterialCommunityIcons
                      name="chat"
                      size={24}
                      color={messageColor}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.editButton}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color={theme.colors.secondary}
                  />
                  <Text style={styles.editButtonText}> Edit profile</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.bottomView}>
          <ScrollView contentContainerStyle={styles.bottomScroll} horizontal>
            {user.uid === userProfile.uid && (
              <InterestCard iconName="plus" title="Add card" variant="add">
                Answer some questions to get new cards
              </InterestCard>
            )}
            <InterestCard iconName="school" title="Student">
              {userProfile.firstName} is a student at the University of Oslo
            </InterestCard>
            <InterestCard iconName="account-group" title="The extrovert">
              {userProfile.firstName} has 42 friends on Vicinity!
            </InterestCard>
            <InterestCard iconName="chef-hat" title="Chef">
              {userProfile.firstName} likes cooking
            </InterestCard>
            <InterestCard iconName="office-building" title="Compact">
              {userProfile.firstName} lives in an apartment
            </InterestCard>
            <InterestCard iconName="home-modern" title="Lots of space">
              {userProfile.firstName} lives in a house
            </InterestCard>
            <InterestCard iconName="car-hatchback" title="Car owner">
              {userProfile.firstName} owns a car
            </InterestCard>
            <InterestCard iconName="truck-trailer" title="Trailer owner">
              {userProfile.firstName} owns a trailer
            </InterestCard>
            <InterestCard iconName="dog" title="Animal household">
              {userProfile.firstName} has 2 pets
            </InterestCard>
          </ScrollView>
        </View>
      </View>
    </>
  );
}
