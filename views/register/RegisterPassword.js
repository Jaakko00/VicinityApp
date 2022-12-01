import { createUserWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";

import { auth, firestore } from "../../config/firebase";
import RegisterButton from "./components/RegisterButton";
import { ThemeContext, RegisterContext } from "../../App";

export default function RegisterPassword({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const { error } = route.params;

  const { registerData, setRegisterData } = useContext(RegisterContext);
  const { firstName, lastName, email, password, passwordAgain } = registerData;

  const styles = {
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
      textAlign: "center",
      fontFamily: "Futura",
    },
    logoContainer: {
      height: "20%",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      maxWidth: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    formContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: "white",
      zIndex: 10,
      minHeight: "70%",
      maxHeight: "70%",
      borderBottomLeftRadius: "50%",
    },
    infoTextContainer: {
      margin: theme.size.margin,
    },
    infoText: {
      fontFamily: "Futura",
      fontSize: 18,
    },
    textInputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: "white",
      shadowColor: "#171717",
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      padding: 20,
      margin: theme.size.margin,
    },
    textInput: {
      flex: 1,
      color: "#000",
      fontFamily: "Futura",
      fontSize: 18,
    },

    loginButtonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },

    button: {
      width: "40%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.secondary,
      margin: theme.size.margin,
      padding: 20,
      shadowColor: theme.colors.secondary,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    buttonDisabled: {
      width: "40%",
      opacity: 0.2,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.secondary,
      margin: theme.size.margin,
      padding: 20,
      shadowColor: theme.colors.secondary,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    buttonText: {
      color: "white",
      fontFamily: "Futura",
      fontSize: 18,
    },
    bottomContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    registerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      borderTopRightRadius: 100,
    },
    bottomBubbleContainer: {
      width: "90%",
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    bigBubble: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: "white",
      margin: 10,
    },
    smallBubble: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      backgroundColor: "white",
    },
    registerTextContainer: {
      flexDirection: "row",
      backgroundColor: "white",
      padding: 20,
      borderRadius: "50%",
      width: "80%",
      justifyContent: "center",
    },
    registerText: {
      color: theme.colors.text,
      fontFamily: "Futura",
      fontSize: 18,
    },
    registerTextButton: {
      color: theme.colors.secondary,
      fontFamily: "Futura",
      fontSize: 18,
    },
  };

  return (
    <>
      <SafeAreaView style={{ flexGrow: 0, backgroundColor: "white" }} />
      <SafeAreaView
        style={{ flexGrow: 1, backgroundColor: theme.colors.primary }}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <View style={styles.formContainer}>
                <View style={styles.logoContainer}>
                  <Image
                    style={styles.logo}
                    source={require("../../assets/letsGetStarted.png")}
                  />
                </View>
                {error && (
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Email already in use</Text>
                  </View>
                )}
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Let's get your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, email: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={
                      email.includes("@") && email.includes(".")
                        ? "email-check"
                        : "email"
                    }
                    size={24}
                    color={
                      email.includes("@") && email.includes(".")
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="password"
                    value={password}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, password: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={password.length >= 6 ? "lock-check" : "lock"}
                    size={24}
                    color={
                      password.length >= 6
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter password again"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    textContentType="password"
                    value={passwordAgain}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, passwordAgain: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={
                      passwordAgain.length >= 6 && passwordAgain === password
                        ? "lock-check"
                        : "lock"
                    }
                    size={24}
                    color={
                      passwordAgain.length >= 6 && passwordAgain === password
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.loginButtonContainer}>
                  <TouchableOpacity
                    style={
                      !(
                        password.length >= 6 &&
                        passwordAgain === password &&
                        email.includes("@") &&
                        email.includes(".")
                      )
                        ? styles.buttonDisabled
                        : styles.button
                    }
                    // disabled={
                    //   !(
                    //     password.length >= 6 &&
                    //     passwordAgain === password &&
                    //     email.includes("@") &&
                    //     email.includes(".")
                    //   )
                    // }
                    onPress={() =>
                      navigation.navigate("Register3", {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Next</Text>
                    {password.length >= 6 &&
                    passwordAgain === password &&
                    email.includes("@") &&
                    email.includes(".") ? (
                      <MaterialCommunityIcons
                        style={styles.textInputIcon}
                        name="arrow-right"
                        size={24}
                        color="white"
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.bottomContainer}>
                <View style={styles.registerContainer} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </>
  );
}
