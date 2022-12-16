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
  ImageBackground,
  TouchableWithoutFeedback,
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
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      flex: 1,
      width: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      zIndex: 9999,
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
    cameraButtons: {
      flex: 1,
      justifyContent: "flex-end",
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
        <View>
          <ImageBackground
            style={styles.image}
            source={props.image}
            blurRadius={5}
          >
            <View style={styles.overlay}>
              <MaterialCommunityIcons
                name="image-area"
                size={50}
                color="white"
                style={styles.icon}
              />
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="none"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        presentationStyle="overFullScreen"
        style={{ backgroundColor: "black" }}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
          style={{ backgroundColor: "black" }}
        >
          <ImageBackground
            source={props.image}
            style={{ flex: 1, backgroundColor: "black" }}
          />
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
