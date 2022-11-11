import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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

import { AuthenticatedUserContext } from "../App";
import Avatar from "./Avatar";
import UserModal from "./UserModal/UserModal";

export default function StoryAvatar(props) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const styles = {
    avatar: {},
    modalView: {
      height: "100%",
      backgroundColor: "white",
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
    storyRing: {
      borderWidth: 2,
      maxWidth: props.width + 4,
      minWidth: props.width + 4,
      maxHeight: props.width + 4,
      minHeight: props.width + 4,
      borderRadius: "50%",
      borderColor: "#E40066",
    },
  };
  return (
    <View>
      <View style={styles.storyRing}>
        <Avatar
          image={props.image}
          width={props.width}
          onPress={() => setModalVisible(!modalVisible)}
          story
        />
      </View>

      <UserModal
        onClose={() => {
          setModalVisible(!modalVisible);
        }}
        open={modalVisible}
        user={props.user}
        image={props.image}
        navigation={props.navigation}
      />
    </View>
  );
}
