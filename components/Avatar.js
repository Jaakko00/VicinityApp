import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as React from "react";
import { useEffect, useState } from "react";
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
} from "react-native";

export default function Avatar(props) {
  const styles = {
    avatar: {
      overflow: "hidden",
      borderRadius: Number(props.width) / 2,

      maxWidth: props.width,
      minWidth: props.width,
      maxHeight: props.width,
      minHeight: props.width,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    storyAvatar: {
      overflow: "hidden",
      borderRadius: Number(props.width) / 2,

      maxWidth: props.width,
      minWidth: props.width,
      maxHeight: props.width,
      minHeight: props.width,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#fff",
      
    },
    image: {
      width: props.width,
      height: props.width,
    },
    spinner: {},
  };
  return (
    <TouchableOpacity
      style={props.story ? styles.storyAvatar : styles.avatar}
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={props.onPress}
    >
      {props.loading && (
        <ActivityIndicator style={styles.spinner} size="large" />
      )}
      {!props.loading && (
        <Image style={styles.image} source={{ uri: props.image }} />
      )}
    </TouchableOpacity>
  );
}
