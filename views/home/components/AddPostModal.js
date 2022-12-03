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
  GeoPoint,
  serverTimestamp,
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
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import uuid from "react-native-uuid";
import { SafeAreaView } from "react-navigation";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";
import PostImagePicker from "./PostImagePicker";
import SendPostButton from "./SendPostButton";
import SimpleHeader from "../../../components/SimpleHeader";
import CameraModal from "./CameraModal";

export default function AddPostModal(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    textInputContainer: {
      height: "50%",
      padding: 10,
      borderRadius: 10,
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    textInput: {
      backgroundColor: "white",
      height: "100%",
      padding: 10,
      borderRadius: 10,
      fontSize: 18,
      fontFamily: "Futura",
    },
    buttonContainers: {
      justifyContent: "space-between",
      flexDirection: "row",
    },

    button: {
      width: "40%",
      height: 60,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.secondary,
      margin: theme.size.margin,

      shadowColor: theme.colors.secondary,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    buttonDisabled: {
      width: "40%",
      height: 60,
      opacity: 0.2,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.secondary,
      margin: theme.size.margin,
      shadowColor: theme.colors.secondary,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    extraButtonContainer: {
      flexDirection: "row",
    },
    extraButton: {
      height: 60,
      aspectRatio: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.secondary,
      margin: theme.size.margin,
      shadowColor: theme.colors.secondary,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    buttonText: {
      color: "white",
      fontFamily: "Futura",
      fontSize: 18,
    },
  };

  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const { user, setUser, userInfo } = useContext(AuthenticatedUserContext);

  const storage = getStorage();

  const handlePostSaved = async (pickerResult) => {
    if (postImage) {
      try {
        setLoading(true);
        if (!pickerResult.cancelled) {
          const uploadUrl = await uploadPostImage(pickerResult.uri);
          savePost(uploadUrl);
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
        setLoading(false);
      }
    } else {
      setLoading(true);
      savePost();
    }
  };
  const uploadPostImage = async (uri) => {
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

    const fileRef = ref(storage, "images/" + uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    console.log("Uploaded image", result);
    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const savePost = async (url) => {
    if (postText) {
      await setDoc(doc(firestore, "post", uuid.v4()), {
        text: postText,
        image: url || null,
        postedAt: Date.now(),
        userRef: doc(firestore, "user", user.uid),
        uid: user.uid,
        location: userInfo.location,
      });
      setLoading(false);
      onClose();
      props.getPosts();
    }
  };

  const onClose = () => {
    props.setModalVisible(!props.modalVisible);
    setPostImage("");
    setPostText("");
  };

  return (
    <Modal
      animationType="fade"
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(false);
      }}
      presentationStyle="overFullScreen"
    >
      <SimpleHeader setModal={props.setModalVisible} title="New post" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flexGrow: 1 }}
        disabled
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="What's on your mind?"
              multiline
              value={postText}
              onChange={(text) => setPostText(text)}
              style={styles.textInput}
            />
          </View>
          <View style={styles.buttonContainers}>
            <View style={styles.extraButtonContainer}>
              <TouchableOpacity
                style={styles.extraButton}
                onPress={() => setCameraOpen(true)}
              >
                <MaterialCommunityIcons name="camera" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.extraButton}>
                <MaterialCommunityIcons name="at" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={!postText.length ? styles.buttonDisabled : styles.button}
              disabled={!postText.length}
            >
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {cameraOpen && (
        <CameraModal cameraOpen={cameraOpen} setCameraOpen={setCameraOpen} />
      )}
    </Modal>
  );
}
