import { signInWithEmailAndPassword } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useContext } from "react";
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
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { ThemeContext } from "../../App";

import { LinearGradient } from "expo-linear-gradient";

import { auth } from "../../config/firebase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { theme } = useContext(ThemeContext);
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
      minHeight: "50%",
      maxHeight: "60%",
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
    creditTextContainer: {},
    creditText: {
      color: theme.colors.text,
      fontFamily: "Futura",
      fontSize: 12,
      textAlign: "center",
    },
  };

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Login success"))
        .catch((err) => handleLoginError(err));
    } else {
      console.log("Please give email and password");
    }
  };

  const handleLoginError = (err) => {
    setError(true);
    setEmail("");
    setPassword("");
    console.log(err);
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
                    source={require("../../assets/Vicinity-text-transparent.png")}
                  />
                </View>
                {error && (
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>
                      Invalid username or password
                    </Text>
                  </View>
                )}
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name="account"
                    size={24}
                    color={
                      email.length
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
                    onChangeText={(text) => setPassword(text)}
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name={password.length ? "lock-open" : "lock"}
                    size={24}
                    color={
                      password.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.loginButtonContainer}>
                  <TouchableOpacity
                    style={
                      !(password.length && email.length)
                        ? styles.buttonDisabled
                        : styles.button
                    }
                    disabled={!(password.length && email.length)}
                    onPress={onHandleLogin}
                  >
                    <Text style={styles.buttonText}>Login</Text>
                    {password.length && email.length ? (
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
                <View style={styles.registerContainer}>
                  <View style={styles.registerTextContainer}>
                    <TouchableOpacity disabled>
                      <Text style={styles.registerText}>
                        Don't have an account?
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate("Register1")}
                    >
                      <Text style={styles.registerTextButton}> Sign up!</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomBubbleContainer}>
                    <View style={styles.bigBubble} />
                  </View>
                  <View style={styles.bottomBubbleContainer}>
                    <View style={styles.smallBubble} />
                  </View>
                </View>
              </View>

              <View style={styles.creditTextContainer}>
                <Text style={styles.creditText}>Jaakko Saranpää, 2022</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </>
  );
}
