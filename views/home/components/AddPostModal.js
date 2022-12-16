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
import { Geohash, geohashForLocation, Geopoint } from "geofire-common";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";
import PostImagePicker from "./PostImagePicker";
import SendPostButton from "./SendPostButton";
import SimpleHeader from "../../../components/SimpleHeader";
import CameraModal from "./CameraModal";
import PreviewImage from "./PreviewImage";

export default function AddPostModal(props) {
  const { theme } = useContext(ThemeContext);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const { user, setUser, userInfo } = useContext(AuthenticatedUserContext);
  const styles = {
    textInputContainer: {
      height: postImage ? "50%" : "70%",
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
    previewImageContainer: {
      margin: 10,
    },
  };

  const storage = getStorage();

  const handlePostSaved = async () => {
    if (postImage) {
      try {
        setLoading(true);

        const uploadUrl = await uploadPostImage(postImage.uri);
        savePost(uploadUrl);
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
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileRef = ref(storage, "images/" + uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    console.log("Uploaded image", result);
    // We're done with the blob, close and release it

    return await getDownloadURL(fileRef);
  };

  const savePost = async (url) => {
    if (postText) {
      const hash = geohashForLocation([
        userInfo.location.latitude,
        userInfo.location.longitude,
      ]);
      console.log("hash", hash);
      await setDoc(doc(firestore, "post", uuid.v4()), {
        text: postText,
        image: url || null,
        postedAt: Date.now(),
        userRef: doc(firestore, "user", user.uid),
        uid: user.uid,
        location: userInfo.location,
        hash: hash,
      });
      setLoading(false);
      onClose();
      props.getPosts();
    }
  };

  const onClose = () => {
    props.setModalVisible(!props.modalVisible);
    setPostImage(null);
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
      <SimpleHeader onClose={onClose} title="New post" />
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
              onChangeText={(text) => setPostText(text)}
              style={styles.textInput}
              autoFocus
            />
          </View>
          {postImage && (
            <View style={styles.previewImageContainer}>
              <PreviewImage width="100%" height={80} image={postImage} />
            </View>
          )}
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
              onPress={() => handlePostSaved()}
            >
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {cameraOpen && (
        <CameraModal
          cameraOpen={cameraOpen}
          setCameraOpen={setCameraOpen}
          setPostImage={setPostImage}
        />
      )}
    </Modal>
  );
}
