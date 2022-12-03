import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { View } from "react-native";

import { AuthenticatedUserContext } from "../App";
import Avatar from "./Avatar";

export default function UserAvatar(props) {
  const styles = {
    avatar: {},
    modalView: {
      height: "100%",
      backgroundColor: "white",
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
      backgroundColor: "#121212",
      width: "50%",
      height: 5,
      borderRadius: "50%",
      marginBottom: 10,
    },
    modalImage: {
      width: "100%",
      minHeight: "50%",
      borderRadius: 10,
    },
  };
  return (
    <View>
      <Avatar
        image={props.image}
        width={props.width}
        onPress={() => {
          if (props.home) {
            props.navigation.navigate("UserProfileHome", {
              userProfile: props.user,
              home: true,
            });
          } else {
            props.navigation.navigate("UserProfile", {
              userProfile: props.user,
            });
          }
          if(props.callback) {
            props.callback();
          }
        }}
      />
    </View>
  );
}
