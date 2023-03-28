import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Audio } from "expo-av";
import { AuthenticatedUserContext, ThemeContext } from "../../../App";

export default function InputField(props) {
  const { theme } = useContext(ThemeContext);
  const styles = {
    inputContainer: {
      backgroundColor: theme.colors.background,
    },
    flexContainer: {
      flexDirection: "row",
      borderWidth: 2,
      borderRadius: 40,
      margin: 5,
      borderColor: theme.colors.secondary,
      alignItems: "flex-end",
    },
    flexContainerFocus: {
      flexDirection: "row",
      borderWidth: 2,
      borderRadius: 40,
      margin: 5,
      borderColor: theme.colors.secondary,
      alignItems: "flex-end",
    },
    textInput: {
      padding: 10,
      paddingLeft: 20,
      paddingTop: 10,
      fontFamily: "Futura",
      width: "80%",
      color: theme.colors.text,
      borderTopLeftRadius: 40,
      borderBottomLeftRadius: 40,
      backgroundColor: theme.colors.textBackground,
    },

    sendButton: {
      paddingTop: 10,
      paddingBottom: 10,
      padding: 10,
      fontFamily: "Futura",
      flexGrow: 1,

      marginLeft: 0,
      height: 38,
      borderTopRightRadius: 40,
      borderBottomRightRadius: 40,
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.textBackground,
    },
    sendIcon: {
      textAlign: "center",
    },
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sound, setSound] = useState();


  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/base-403.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  };

  const onSendMessage = () => {
    playSound();
    props.sendNewMessage(newMessage);

    setNewMessage("");
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.flexContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="New message"
          placeholderTextColor={theme.colors.textSecondary}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          multiline
          maxLength={120}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSendMessage}
          disabled={!newMessage}
        >
          <Text>
            <MaterialCommunityIcons
              name="send"
              size={19}
              color={theme.colors.secondary}
              style={styles.sendIcon}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
