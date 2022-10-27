import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ImageBackground,
} from "react-native";

import { auth } from "../../config/firebase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Login success"))
        .catch((err) => console.log(`Login err: ${err}`));
    } else {
      console.log("Please give email and password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <ImageBackground source={require("../../assets/LoginBG.jpeg")} style={styles.container} >
            <Text style={styles.header}>Welcome back!</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              textContentType="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Button onPress={onHandleLogin} color="#f57c00" title="Login" />
            <Button
              onPress={() => navigation.navigate("Register")}
              title="Register"
            />
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 36,
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Futura",
  },
  textInput: {
    height: 40,
    borderColor: "#E40066",
    borderRadius: 10,
    padding: 10,
    color: "#000",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    margin: 20,
    marginBottom: 5,
    marginTop: 5,
    fontFamily: "Futura",
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});
