import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { AuthenticatedUserContext, ThemeContext } from "../../../App";

export default function HomeHeader(props) {
  const { user, setUser, inpendingFriends } = useContext(
    AuthenticatedUserContext
  );
  const { theme } = useContext(ThemeContext);
  const styles = {
    header: {
      zIndex: 999,
      backgroundColor: "#fff",
      width: "100%",
      height: "15%",
      justifyContent: "flex-end",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: "100%",
    },
    logo: {
      maxWidth: "40%",
      height: "50%",
      resizeMode: "contain",
      margin: 10,
    },
    accountIcon: {
      width: 40,
      margin: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  };
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          source={require("../../../assets/Vicinity-text-transparent.png")}
        />
        <View style={styles.accountIcon}>
          {/* <TouchableOpacity onPress={() => props.navigation.navigate("User")}>
            <Text>
              <MaterialCommunityIcons name="account" size={35} color="#000" />
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Friends")}
          >
            <View>
              <MaterialCommunityIcons
                name="account-group"
                size={35}
                color="#000"
              />
              {inpendingFriends.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -4,
                    top: -4,
                    backgroundColor: theme.colors.primary,
                    borderRadius: "50%",
                    borderWidth: 2,
                    borderColor: theme.colors.background,

                    padding: 2,

                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="exclamation-thick"
                    color={theme.colors.background}
                    size={12}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
