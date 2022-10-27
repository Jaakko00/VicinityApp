import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { Text, View, Button, Share } from "react-native";

import { AuthenticatedUserContext } from "../../App";
import Avatar from "../../components/Avatar";
import EditAvatar from "../../components/EditAvatar";
import { auth, firestore } from "../../config/firebase";

export default function UserView() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();

  const getUserInfo = async (uid) => {
    setLoading(true);
    const querySnapshot = await getDoc(doc(firestore, "user", uid));
    setUserInfo(querySnapshot.data());
    setLoading(false);
  };

  useEffect(() => {
    getUserInfo(user.uid);
  }, []);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  return (
    <View className="flex-1 items-center justify-center bg-teal-100">
      <EditAvatar width={150} userInfo={userInfo} loading={loading} />
      <Text className="font-bold text-lg">{userInfo?.firstName}</Text>
      <Text className="font-bold text-lg">{userInfo?.lastName}</Text>
      <Text className="font-bold text-lg">{userInfo?.email}</Text>
      <Button title="Sign out" onPress={onSignOut} />
    </View>
  );
}
