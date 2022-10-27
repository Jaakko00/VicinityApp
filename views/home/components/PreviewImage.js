import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Modal,
} from "react-native";

export default function PreviewImage(props) {
  const [viewWidth, setViewWidth] = useState();
  const styles = {
    avatar: {
      overflow: "hidden",
      borderRadius: 10,

      height: props.height,
    },
    image: {
      width: props.width,
      height: props.height,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    icon: {
      zIndex: 9999,
      position: "absolute",

      bottom: Number(props.height) / 2 - 25,

      left: Number(viewWidth) / 2 - 25 || "50%",
    },
    modalView: {
      height: "100%",
      backgroundColor: "#121212",
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
    modalImage: {
      width: "100%",
      minHeight: "50%",
      borderRadius: 10,
    },
  };

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <TouchableOpacity
        style={styles.avatar}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => setModalVisible(true)}
      >
        <View
          onLayout={(event) => {
            setViewWidth(event.nativeEvent.layout.width);
          }}
        >
          <Image
            style={styles.image}
            source={{ uri: props.image }}
            blurRadius={5}
          />
          <View style={styles.overlay} />
        </View>
        <MaterialCommunityIcons
          name="image-area"
          size={50}
          color="white"
          style={styles.icon}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        presentationStyle="pageSheet"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.topBar}
              onPress={() => setModalVisible(!modalVisible)}
            />

            <Image style={styles.modalImage} source={{ uri: props.image }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
