import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { AuthenticatedUserContext } from "../../../App";
import AddPostModal from "./AddPostModal";

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
  const { user, setUser, userInfo } = useContext(AuthenticatedUserContext);

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
      <AddPostModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}
