import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import * as React from "react";
import { useEffect, useState, createContext, useContext } from "react";
import { Text, View, ActivityIndicator, LogBox } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";

import { auth, firestore } from "./config/firebase";
import HomeView from "./views/home/Home";
import LoginView from "./views/login/Login";
import MessageView from "./views/message/Message";
import NeighbourhoodView from "./views/neighbourhood/Neighbourhood";
import RegisterView from "./views/register/Register";
import UserView from "./views/user/User";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const AuthenticatedUserContext = createContext({});

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core",
  "Require cycle: App.js",
  "EventEmitter.removeListener",
]);

function NavigationTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#E40066",
        tabBarInactiveTintColor: "#000",
        tabBarActiveBackgroundColor: "transparent",
        tabBarInactiveBackgroundColor: "transparent",
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
        },

        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Tab.Screen
        name="Neighbourhood"
        component={NeighbourhoodView}
        options={{
          tabBarLabel: "Neighbourhood",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeView}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageView}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthenticationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="Register" component={RegisterView} />
    </Stack.Navigator>
  );
}

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(firestore, "user", user.uid)).then((querySnapshot) =>
        setUserInfo(querySnapshot.data())
      );
    }
  }, [user]);

  return (
    <AuthenticatedUserContext.Provider
      value={{ user, setUser, userInfo, setUserInfo }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <NavigationTabs /> : <AuthenticationStack />}
    </NavigationContainer>
  );
}

export default function App() {
  const navTheme = {
    colors: {
      background: "#fff",
    },
  };

  return (
    <TailwindProvider>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </TailwindProvider>
  );
}
