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
import {
  Text,
  View,
  Button,
  Share,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";


import { AuthenticatedUserContext } from "../../../App";
import { auth, firestore } from "../../../config/firebase";

export default function PostImagePicker(props) {


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    props.setPostImage(result);
  };

  const [viewWidth, setViewWidth] = useState();

  const styles = {
    avatar: {
      overflow: "hidden",
      borderRadius: 10,
      height: 80,
      width: "90%",
      marginTop: 10,
    },
    image: {
      width: "100%",
      height: 80,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    icon: {
      zIndex: 9999,
      position: "absolute",

      bottom: Number(80) / 2 - 25,

      left: Number(viewWidth) / 2 - 25 || "50%",
    },
  };

  return (
    <View style={styles.avatar}>
      <TouchableOpacity
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={pickImage}
      >
        <View
          onLayout={(event) => {
            setViewWidth(event.nativeEvent.layout.width);
          }}
        >
          <Image style={styles.image} source={{ uri: props.postImage?.uri }} />
          <View style={styles.overlay} />
        </View>
        <MaterialCommunityIcons
          name={props.postImage ? "image-edit" : "image-plus"}
          size={50}
          color="white"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}
