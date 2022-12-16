import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Camera,
  CameraType,
  FlashMode,
  CameraPictureOptions,
} from "expo-camera";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
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
} from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import PreviewCameraImageModal from "./PreviewCameraImageModal";

export default function CameraModal(props) {
  const { theme } = useContext(ThemeContext);
  const [type, setType] = useState(CameraType.back);
  const [status, requestPermission] = Camera.useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [image, setImage] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraPreviewOpen, setCameraPreviewOpen] = useState(false);
  const ref = useRef(null);

  const styles = {
    cameraButtons: {
      flex: 1,
      justifyContent: "space-between",
    },
    topCameraButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
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
      borderWidth: 10,
      margin: 30,
      borderColor: "white",
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
  };
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const handleTakePicture = async () => {
    if (ref.current && cameraReady) {
      let data = await ref.current.takePictureAsync();

      console.log(data);
      if (type === CameraType.front) {
        data = await manipulateAsync(
          data.localUri || data.uri,
          [{ rotate: 180 }, { flip: FlipType.Vertical }],
          { compress: 0, format: SaveFormat.JPEG }
        );
      } else {
        data = await manipulateAsync(data.localUri || data.uri, [], {
          compress: 0,
          format: SaveFormat.JPEG,
        });
      }
      setImage(data);
      setCameraPreviewOpen(true);
    }
  };

  const handleClose = () => {
    setImage(null);
    ref.current.pausePreview();
    props.setCameraOpen(false);
  };

  useEffect(() => {
    if (cameraPreviewOpen) {
      ref.current.resumePreview();
    }
  }, []);

  return (
    <Modal
      animationType="fade"
      visible={props.cameraOpen}
      onRequestClose={() => {
        props.setCameraOpen(false);
      }}
      presentationStyle="overFullScreen"
    >
      <Camera
        style={{ flexGrow: 1 }}
        type={type}
        onMountError={(e) => console.log(e)}
        onCameraReady={() => setCameraReady(true)}
        ref={ref}
        flashMode={flashOn ? FlashMode.on : FlashMode.off}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.cameraButtons}>
            <View style={styles.topCameraButtons}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setFlashOn(!flashOn);
                }}
              >
                <MaterialCommunityIcons
                  name={flashOn ? "flash" : "flash-off"}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomCameraButtons}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleClose()}
              >
                <MaterialCommunityIcons name="close" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pictureButton}
                onPress={handleTakePicture}
              >
                <MaterialCommunityIcons
                  name="camera-iris"
                  size={60}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraType}
              >
                <MaterialCommunityIcons
                  name="camera-flip"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Camera>
      {image && cameraPreviewOpen && (
        <PreviewCameraImageModal
          image={image}
          setImage={setImage}
          setPostImage={props.setPostImage}
          cameraPreviewOpen={cameraPreviewOpen}
          setCameraPreviewOpen={setCameraPreviewOpen}
          setCameraOpen={props.setCameraOpen}
        />
      )}
    </Modal>
  );
}
