import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { AuthenticatedUserContext, ThemeContext } from "../../../App";
import AddPostModal from "./AddPostModal";

export default function AddPostButton(props) {
  const { theme } = useContext(ThemeContext);

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
              color={theme.colors.text}
            />
          </Text>
        </TouchableOpacity>
      </View>
      <AddPostModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        getPosts={props.getPosts}
      />
    </View>
  );
}
