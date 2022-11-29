import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  updateDoc,
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
import { Text, View, Button, Share, ActivityIndicator } from "react-native";
import uuid from "react-native-uuid";

import { AuthenticatedUserContext } from "../App";
import Avatar from "../components/Avatar";
import { auth, firestore } from "../config/firebase";

export default function GroupEditAvatar(props) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [groupImage, setGroupImage] = useState(props.group?.avatar);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const storage = getStorage();

  

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  useEffect(() => {
    setGroupImage(props.group?.avatar);
  }, [props.group]);

  const handleImagePicked = async (pickerResult) => {
    try {
      setLoading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadUserImage(pickerResult.uri);
        setGroupImage(uploadUrl);
        saveGroupImagePath(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setLoading(false);
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

    const fileRef = ref(storage, "avatars/" + uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    console.log("Uploaded image", result);
    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const saveGroupImagePath = async (Url) => {
    console.log("KÄYTTÄJÄ", { user });
    if (Url) {
      await updateDoc(doc(firestore, "group", props.group.id), {
        avatar: Url,
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    console.log({ result });

    handleImagePicked(result);
  };

  const styles = {
    icon: {},
    badge: {
      position: "absolute",
      left: props.width - 40,
      top: props.width - 40,
      backgroundColor: "#d81e5b",
      flex: 1,
      maxHeight: 40,
      minHeight: 40,
      width: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
    },
  };

  return (
    <View>
      <Avatar
        width={props.width}
        onPress={pickImage}
        image={groupImage}
        loading={loading}
      />
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name="pencil-outline"
          size={25}
          color="white"
          style={styles.icon}
        />
      </View>
    </View>
  );
}
