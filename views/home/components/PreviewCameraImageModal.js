import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";

import * as React from "react";
import { useEffect, useState, useContext, useRef } from "react";
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
  SafeAreaView,
  ImageBackground,
} from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";

export default function PreviewCameraImageModal(props) {
  const { theme } = useContext(ThemeContext);

  const styles = {
    cameraButtons: {
      flex: 1,
      justifyContent: "flex-end",
    },
    topCameraButtons: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    bottomCameraButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeButton: {
      margin: 30,
    },
    flipButton: {
      margin: 30,
    },
    pictureButton: {
      width: 100,
      height: 100,

      margin: 30,

      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const handleClosePreview = () => {
    props.setCameraPreviewOpen(false);
    props.setImage(null);
  };

  const handleSelectImage = () => {
    props.setPostImage(props.image);
    props.setImage(null);
    props.setCameraPreviewOpen(false);
    props.setCameraOpen(false);
  };

  return (
    <Modal
      animationType="fade"
      visible={props.cameraPreviewOpen}
      onRequestClose={() => {
        handleClosePreview();
      }}
      presentationStyle="overFullScreen"
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "black" }}
        resizeMode="cover"
      >
        <ImageBackground source={props.image} style={{ flex: 1 }}>
          <View style={styles.cameraButtons}>
            <View style={styles.bottomCameraButtons}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleClosePreview()}
              >
                <MaterialCommunityIcons name="close" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.pictureButton} disabled />
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => handleSelectImage()}
              >
                <MaterialCommunityIcons name="check" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </Modal>
  );
}
