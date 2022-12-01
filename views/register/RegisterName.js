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

export default function RegisterName({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const { registerData, setRegisterData } = useContext(RegisterContext);
  const { firstName, lastName, email, password } = registerData;

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
    headerText: {
      fontSize: 18,

      fontFamily: "Futura",
    },
    formContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: "white",
      zIndex: 10,
      minHeight: "60%",
      maxHeight: "60%",
      borderBottomRightRadius: "50%",
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
      backgroundColor: theme.colors.secondary,
      borderTopLeftRadius: 100,
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
        style={{ flexGrow: 1, backgroundColor: theme.colors.secondary }}
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
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="What's your first name?"
                    autoCapitalize="words"
                    textContentType="givenName"
                    value={firstName}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, firstName: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={firstName.length ? "account" : "account-question"}
                    size={24}
                    color={
                      firstName.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="What about your last name?"
                    autoCapitalize="words"
                    textContentType="familyName"
                    value={lastName}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, lastName: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={lastName.length ? "account" : "account-question"}
                    size={24}
                    color={
                      lastName.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.loginButtonContainer}>
                  <TouchableOpacity
                    style={
                      !(firstName.length && lastName.length)
                        ? styles.buttonDisabled
                        : styles.button
                    }
                    disabled={!(firstName.length && lastName.length)}
                    onPress={() =>
                      navigation.navigate("Register2", {
                        firstName: firstName,
                        lastName: lastName,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Next</Text>
                    {firstName.length && lastName.length ? (
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
