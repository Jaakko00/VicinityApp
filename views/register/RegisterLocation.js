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
  GeoPoint,
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
  ActivityIndicator,
} from "react-native";

import { auth, firestore } from "../../config/firebase";
import RegisterButton from "./components/RegisterButton";
import { ThemeContext, RegisterContext } from "../../App";
import * as Location from "expo-location";
import TOSModal from "./components/TOSModal";
import PPModal from "./components/PPModal";

export default function RegisterLocation({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const [TOSModalVisible, setTOSModalVisible] = useState(false);
  const [PPModalVisible, setPPModalVisible] = useState(false);
  const { registerData, setRegisterData } = useContext(RegisterContext);
  const {
    firstName,
    lastName,
    email,
    password,
    passwordAgain,
    street,
    postcode,
    city,
  } = registerData;

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
      minHeight: "80%",
      maxHeight: "80%",
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

    locationButtonContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    infoTextContainer: {
      margin: theme.size.margin,
    },
    infoText: {
      fontFamily: "Futura",
      fontSize: 18,
    },
    registerButtonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },

    registerButton: {
      width: "40%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.primary,
      margin: theme.size.margin,
      padding: 20,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    registerButtonDisabled: {
      width: "40%",
      opacity: 0.2,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: theme.colors.primary,
      margin: theme.size.margin,
      padding: 20,
      shadowColor: theme.colors.primary,
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

  const onHandleSignup = async () => {
    const location = await getLocation();
    console.log("location is", location);
    if (email !== "" && password !== "" && location.length) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => createUser(user, location[0]))
        .catch((err) => handleRegisterError(err))
        .finally(() => setLoadingRegistration(false));
    } else {
      console.log("Please give email and password and location");
    }
  };

  const createUser = async (user, location) => {
    console.log("Creating user for", user);
    if (user) {
      await setDoc(doc(firestore, "user", user.user.uid), {
        email: user._tokenResponse.email,
        uid: user.user.uid,
        firstName,
        lastName,
        street,
        postcode,
        city,
        location: new GeoPoint(location.latitude, location.longitude),
      });
    }
  };

  const handleRegisterError = (err) => {
    console.log("Error while registering", err);
    if (err.code === "auth/email-already-in-use") {
      navigation.navigate("Register2", { error: true });
    }
  };

  const getLocation = async () => {
    setLoadingRegistration(true);

    const location = await Location.geocodeAsync(
      street + " " + postcode + " " + city
    );
    return location;
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
                    placeholder="Enter your street address"
                    autoCapitalize="none"
                    textContentType="streetAddressLine1"
                    value={street}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, street: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name="home"
                    size={24}
                    color={
                      street.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter postcode"
                    autoCapitalize="none"
                    textContentType="postalCode"
                    value={postcode}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, postcode: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name="postage-stamp"
                    size={24}
                    color={
                      postcode.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter city"
                    textContentType="addressCity"
                    value={city}
                    onChangeText={(text) =>
                      setRegisterData({ ...registerData, city: text })
                    }
                  />
                  <MaterialCommunityIcons
                    style={styles.textInputIcon}
                    name="city"
                    size={24}
                    color={
                      city.length
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoText}>
                    By clicking the button below, you agree to our{" "}
                    <Text
                      style={{ color: theme.colors.secondary }}
                      onPress={() => setTOSModalVisible(true)}
                    >
                      Terms of Service
                    </Text>{" "}
                    and{" "}
                    <Text
                      style={{ color: theme.colors.secondary }}
                      onPress={() => setPPModalVisible(true)}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
                <View style={styles.registerButtonContainer}>
                  <TouchableOpacity
                    style={
                      !(
                        street &&
                        postcode &&
                        city &&
                        email &&
                        password &&
                        firstName &&
                        lastName
                      )
                        ? styles.registerButtonDisabled
                        : styles.registerButton
                    }
                    disabled={
                      !(
                        street &&
                        postcode &&
                        city &&
                        email &&
                        password &&
                        firstName &&
                        lastName
                      )
                    }
                    onPress={() => onHandleSignup()}
                  >
                    {loadingRegistration ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={styles.buttonText}>Register</Text>
                    )}
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
      <TOSModal
        TOSModalVisible={TOSModalVisible}
        setTOSModalVisible={setTOSModalVisible}
      />
      <PPModal
        PPModalVisible={PPModalVisible}
        setPPModalVisible={setPPModalVisible}
      />
    </>
  );
}
