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
import Avatar from "./Avatar";
import { auth, firestore } from "../config/firebase";

export default function GroupEditAvatar(props) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const storage = getStorage();

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    console.log({ result });

    props.setGroupImageResult(result);
    //handleImagePicked(result);
  };

  const styles = {
    icon: {},
    badge: {
      position: "absolute",
      left: props.width - 20,
      top: props.width - 20,
      backgroundColor: "#d81e5b",
      flex: 1,
      maxHeight: 20,
      minHeight: 20,
      width: 20,
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
        image={props.groupImage}
        loading={loading}
      />
      <View style={styles.badge}>
        <MaterialCommunityIcons
          name="plus"
          size={16}
          color="white"
          style={styles.icon}
        />
      </View>
    </View>
  );
}
