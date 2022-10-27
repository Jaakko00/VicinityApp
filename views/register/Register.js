import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
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
} from "react-native";

import { auth, firestore } from "../../config/firebase";
import RegisterButton from "./components/RegisterButton";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const onHandleSignup = () => {
    if (email !== "" && password !== "") {
      if (password === passwordAgain) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => createUser(user))
          .catch((err) => console.log(`Login err: ${err}`));
      } else {
        console.log("Passwords are not same");
      }
    } else {
      console.log("Please give email and password");
    }
  };

  const createUser = async (user) => {
    console.log("Creating user for", user);
    if (user) {
      await setDoc(doc(firestore, "user", user.user.uid), {
        email: user._tokenResponse.email,
        uid: user.user.uid,
        phone,
        firstName,
        lastName,
        street1,
        street2,
        postal,
        city,
      });
    }
  };

  const allowRegistration = Boolean(
    email &&
      phone &&
      firstName &&
      lastName &&
      street1 &&
      postal &&
      city &&
      password &&
      password === passwordAgain
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <ImageBackground
            source={require("../../assets/LoginBG.jpeg")}
            style={styles.container}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.container}>
                <Text style={styles.header}>Create new account</Text>
                <Text style={styles.subheader}>General</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone number"
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  value={phone}
                  onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="First name"
                  autoCapitalize="words"
                  textContentType="givenName"
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Last name"
                  autoCapitalize="words"
                  textContentType="familyName"
                  value={lastName}
                  onChangeText={(text) => setLastName(text)}
                />
                <Text style={styles.subheader}>Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Address line 1"
                  autoCapitalize="words"
                  textContentType="streetAddressLine1"
                  value={street1}
                  onChangeText={(text) => setStreet1(text)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Address line 2 (optional)"
                  autoCapitalize="words"
                  textContentType="streetAddressLine2"
                  value={street2}
                  onChangeText={(text) => setStreet2(text)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="postcode / ZIP"
                  autoCapitalize="none"
                  textContentType="postalCode"
                  value={postal}
                  onChangeText={(text) => setPostal(text)}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="City"
                  autoCapitalize="words"
                  textContentType="addressCity"
                  value={city}
                  onChangeText={(text) => setCity(text)}
                />
                <Text style={styles.subheader}>Password</Text>
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
                <TextInput
                  style={styles.textInput}
                  placeholder="Password again"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  textContentType="password"
                  value={passwordAgain}
                  onChangeText={(text) => setPasswordAgain(text)}
                />

                <RegisterButton
                  onPress={onHandleSignup}
                  disabled={!allowRegistration}
                />
              </View>
            </ScrollView>
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
    justifyContent: "space-around",
    height: 100,
  },
  header: {
    fontSize: 36,
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Futura",
  },
  subheader: {
    margin: 20,
    marginBottom: 5,
    marginTop: 15,
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
});
