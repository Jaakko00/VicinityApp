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
} from "react-native";
import uuid from "react-native-uuid";
import { SafeAreaView } from "react-navigation";

import { AuthenticatedUserContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";
import PostImagePicker from "./PostImagePicker";
import SendPostButton from "./SendPostButton";

export default function AddPostButton(props) {
  const styles = {
    buttonContainer: {
      zIndex: 999,
      position: "absolute",
      flex: 1,
      flexDirection: "column",
      right: 10,
      bottom: 10,
      padding: 5,
      margin: 0,
      backgroundColor: "#E40066",
      borderRadius: "50%",
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
    textInput: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      width: "90%",
      height: "50%",
      fontFamily: "Futura",
    },
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthenticatedUserContext);

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
      });
      setLoading(false);
      onClose();
      props.getPosts();
    }
  };

  const onClose = () => {
    setModalVisible(!modalVisible);
    setPostImage("");
    setPostText("");
  };

  return (
    <View>
      <View>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Text>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={35}
              color="#000"
            />
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        presentationStyle="pageSheet"
      >
        <View>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalView}>
              <Pressable
                style={styles.topBar}
                onPress={() => setModalVisible(!modalVisible)}
              />

              <TextInput
                style={styles.textInput}
                onChangeText={setPostText}
                value={postText}
                placeholder="Please tell us whats on your mind! 😄"
                multiline
              />
              <PostImagePicker
                setPostImage={setPostImage}
                postImage={postImage}
              />
              <SendPostButton
                onClose={onClose}
                onSave={() => handlePostSaved(postImage)}
                postText={postText}
                loading={loading}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}
