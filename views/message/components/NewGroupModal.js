import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  addDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
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
import uuid from "react-native-uuid";
import { SafeAreaView, ThemeColors } from "react-navigation";
import GroupAddAvatar from "../../../components/GroupAddAvatar";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";

export default function NewGroupModal(props) {
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");

  const [groupImageResult, setGroupImageResult] = useState(null);

  const { user, userInfo, approvedFriends, newMessages } = useContext(
    AuthenticatedUserContext
  );
  const { theme } = useContext(ThemeContext);
  const storage = getStorage();

  const alreadyInGroup = props.groups.length > 0;

  const styles = {
    modalView: {
      height: "100%",
      backgroundColor: "#E40066",
      padding: theme.size.paddingBig,
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
      padding: theme.size.paddingSmall,
      width: "90%",
      borderRadius: theme.size.borderRadius,
    },
    modalText: {
      padding: theme.size.paddingSmall,
      paddingLeft: theme.size.paddingBig,
      fontFamily: "Futura",
      fontSize: 18,
    },
    modalInfoText: {
      padding: theme.size.paddingSmall,
      paddingLeft: theme.size.paddingBig,
      fontFamily: "Futura",
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    modalInfoTextImportant: {
      padding: theme.size.paddingSmall,
      paddingLeft: theme.size.paddingBig,
      fontFamily: "Futura",
      fontSize: 14,
      color: theme.colors.text,
    },
    modalButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      alignItems: "center",
    },
    modalButtonDisabled: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      alignItems: "center",
      opacity: 0.2,
    },
    modalButtonText: {
      color: "white",
      fontFamily: "Futura",
      fontSize: 18,
    },
    newGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    newGroupTextInput: {
      backgroundColor: "white",
      flex: 1,
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      fontSize: 18,
      fontFamily: "Futura",
    },
    textInput: {
      backgroundColor: "white",
      borderRadius: theme.size.borderRadius,
      padding: theme.size.paddingBig,
      fontSize: 18,
      fontFamily: "Futura",
    },
    modalImage: {
      width: 60,
      height: 60,
      margin: theme.size.margin,
    },
  };

  const handleImagePicked = async (pickerResult, groupId) => {
    try {
      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadUserImage(pickerResult.uri);
        saveGroupImagePath(uploadUrl, groupId);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveGroupImagePath = async (Url, groupId) => {
    if (Url) {
      await updateDoc(doc(firestore, "group", groupId), {
        avatar: Url,
      });
    }
  };

  const uploadUserImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, "groupAvatars/" + uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    console.log("Uploaded image", result);
    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const joinGroup = async () => {
    let alreadyWereInGroup = false;
    const groupRef = doc(firestore, "group", groupCode);
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const groupDoc = await getDoc(groupRef);
    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      const participants = groupData.participants;
      participants.forEach((participant) => {
        if (participant.uid === user.uid) {
          alreadyWereInGroup = true;
        }
      });
      const users = groupData.users;
      participants.push({ uid: user.uid, color: `#${randomColor}` });
      users.push(user.uid);
      if (alreadyWereInGroup) {
        await updateDoc(groupRef, {
          users,
        });
      } else {
        await updateDoc(groupRef, {
          participants,
          users,
        });
      }

      const groupMessagesRef = collection(
        firestore,
        `group/${groupCode}/messages`
      );
      await addDoc(groupMessagesRef, {
        message: `${userInfo.firstName} joined to ${groupData.name}`,
        sentAt: Date.now(),
        type: "info",
      });
      setGroupCode("");
      setGroupName("");
      setGroupImageResult(null);
      props.updateGroups();
      props.setGroupModalVisible(false);
    } else {
      setGroupCode("");
      alert("Group does not exist");
    }
  };

  const createGroup = async () => {
    let randomCode = Math.random().toString().slice(2, 10);
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const groupRef = doc(firestore, "group", randomCode);
    const groupDoc = await getDoc(groupRef);
    while (groupDoc.exists()) {
      console.log("Group with id " + randomCode + " already exists");
      randomCode = Math.random().toString().slice(2, 10);
    }
    await setDoc(groupRef, {
      name: groupName,
      createdAt: Date.now(),
      participants: [{ uid: user.uid, color: `#${randomColor}` }],
      users: [user.uid],
    });
    await handleImagePicked(groupImageResult, randomCode);
    const groupMessagesRef = collection(
      firestore,
      `group/${randomCode}/messages`
    );
    await addDoc(groupMessagesRef, {
      message: `Group ${groupName} created!`,
      sentAt: Date.now(),
      type: "info",
    });
    setGroupName("");
    setGroupCode("");
    setGroupImageResult(null);
    props.updateGroups();
    props.setGroupModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      visible={props.groupModalVisible}
      onRequestClose={() => {
        props.setGroupModalVisible(false);
      }}
      presentationStyle="pageSheet"
    >
      <View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.topBar}
              onPress={() => props.setGroupModalVisible(false)}
            />
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>Join a neighbour group</Text>
              <TextInput
                style={styles.textInput}
                placeholder={
                  !alreadyInGroup
                    ? "Enter 8-digit group code"
                    : "You are already in a group"
                }
                keyboardType="number-pad"
                maxLength={8}
                value={groupCode}
                onChangeText={(text) => setGroupCode(text)}
                clearButtonMode="always"
                editable={!alreadyInGroup}
              />
              <TouchableOpacity
                style={
                  groupCode.length < 8 || alreadyInGroup
                    ? styles.modalButtonDisabled
                    : styles.modalButton
                }
                onPress={() => joinGroup()}
                disabled={groupCode.length < 8 || alreadyInGroup}
              >
                <Text style={styles.modalButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalItem}>
              <Text style={styles.modalText}>
                Or create a new one for your neighbours
              </Text>
              <View style={styles.newGroup}>
                <TextInput
                  style={styles.newGroupTextInput}
                  placeholder={
                    !alreadyInGroup
                      ? "Enter group name"
                      : "You are already in a group"
                  }
                  maxLength={20}
                  value={groupName}
                  onChangeText={(text) => setGroupName(text)}
                  clearButtonMode="always"
                  editable={!alreadyInGroup}
                />
                {!alreadyInGroup && (
                  <View style={styles.modalImage}>
                    <GroupAddAvatar
                      width={60}
                      loading={false}
                      groupImage={groupImageResult?.uri}
                      setGroupImageResult={setGroupImageResult}
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={
                  groupName.length < 4 || alreadyInGroup
                    ? styles.modalButtonDisabled
                    : styles.modalButton
                }
                onPress={() => createGroup()}
                disabled={groupName.length < 4 || alreadyInGroup}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalItem}>
              <Text style={styles.modalInfoText}>
                Groups are a great way to quickly and effortlessly contact your
                neighbours. Your messages can be seen by all members of the
                group.
              </Text>
              <Text style={styles.modalInfoText}>
                You can create a group for your street or apartment building.
                The group creator can share the group code via Vicinity or
                physically with their neighbours.
              </Text>
              <Text style={styles.modalInfoTextImportant}>
                You can only be in one group at a time.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
