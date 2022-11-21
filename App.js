import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { Audio } from "expo-av";
import {
  collection,
  onSnapshot,
  doc,
  where,
  query,
  getDocs,
  getDoc,
  updateDoc,
  orderBy,
  limit,
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
export const ThemeContext = createContext({});

LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core",
  "Require cycle: App.js",
  "EventEmitter.removeListener",
]);

function NavigationTabs({ inpendingFriends, newMessages, theme }) {
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
          labelStyle: {
            fontFamily: "Futura",
          },
        },
        tabBarLabelStyle: {
          fontFamily: "Futura",
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
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageView}
        options={{
          tabBarLabel: "Social",
          tabBarIcon: ({ color, size }) => {
            return (
              <View>
                <MaterialCommunityIcons
                  name="account-supervisor-circle-outline"
                  color={color}
                  size={size}
                />
                {(inpendingFriends.length > 0 || newMessages) && (
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
            );
          },
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

  const [inpendingFriends, setInpendingFriends] = useState([]);
  const [outpendingFriends, setOutpendingFriends] = useState([]);
  const [approvedFriends, setApprovedFriends] = useState([]);
  const [newMessages, setNewMessages] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(firestore, "user", user.uid)).then((querySnapshot) =>
        setUserInfo(querySnapshot.data())
      );
      getFriends();
    }
  }, [user]);

  useEffect(() => {
    if (approvedFriends.length > 0) {
      getMostRecentChatMessages();
    }
  }, [approvedFriends]);

  const playMessageSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/message.mp3")
    );

    await sound.playAsync();
  };

  const getMostRecentChatMessages = async () => {
    approvedFriends.forEach(async (friend, index) => {
      const q = query(
        collection(firestore, "friends", friend.connection_id, "messages"),
        where("uid", "==", friend.uid),
        where("seen", "==", false),
        orderBy("sentAt", "desc"),
        limit(99)
      );
      const unSub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            playMessageSound();
          }
        });
        setNewMessages(false);
        querySnapshot.forEach((doc) => {
          setNewMessages(true);
        });
      });
      return unSub;
    });
  };

  // Gets friends live from firestore
  const getFriends = async () => {
    setApprovedFriends([]);
    setInpendingFriends([]);
    setOutpendingFriends([]);
    // Query where user is the request sender
    const friendQuery1 = query(
      collection(firestore, "friends"),
      where("userRef", "==", doc(firestore, "user", user.uid))
    );

    // Query where user is the request receiver
    const friendQuery2 = query(
      collection(firestore, "friends"),
      where("friendRef", "==", doc(firestore, "user", user.uid))
    );

    // Get friends where user is the request sender
    const unSub1 = onSnapshot(friendQuery1, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          if (change.doc.data().status === "pending") {
            getDoc(change.doc.data().friendRef).then((result) =>
              setOutpendingFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ])
            );
          } else if (change.doc.data().status === "approved") {
            getDoc(change.doc.data().friendRef).then((result) =>
              setApprovedFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ])
            );
          }
        } else if (change.type === "modified") {
          if (change.doc.data().status === "pending") {
            getDoc(change.doc.data().friendRef).then((result) =>
              setOutpendingFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ])
            );
          } else if (change.doc.data().status === "approved") {
            getDoc(change.doc.data().friendRef).then((result) => {
              setOutpendingFriends((oldArray) =>
                oldArray.filter((item) => item.connection_id !== change.doc.id)
              );
              // add the friend to the approvedFriends array
              setApprovedFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ]);
            });
          }
        } else if (change.type === "removed") {
          if (change.doc.data().status === "pending") {
            setOutpendingFriends((oldArray) =>
              oldArray.filter((item) => item.connection_id !== change.doc.id)
            );
          } else if (change.doc.data().status === "approved") {
            setApprovedFriends((oldArray) =>
              oldArray.filter((item) => item.connection_id !== change.doc.id)
            );
          }
        }
      });
    });

    // Get friends where user is the request receiver
    const unSub2 = onSnapshot(friendQuery2, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          if (change.doc.data().status === "pending") {
            getDoc(change.doc.data().userRef).then((result) =>
              setInpendingFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ])
            );
          } else if (change.doc.data().status === "approved") {
            getDoc(change.doc.data().userRef).then((result) =>
              setApprovedFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ])
            );
          }
        } else if (change.type === "modified") {
          if (change.doc.data().status === "pending") {
            getDoc(change.doc.data().userRef).then((result) =>
              setInpendingFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ])
            );
          } else if (change.doc.data().status === "approved") {
            getDoc(change.doc.data().userRef).then((result) => {
              setInpendingFriends((oldArray) =>
                oldArray.filter((item) => item.connection_id !== change.doc.id)
              );
              // add the friend to the approvedFriends array
              setApprovedFriends((oldArray) => [
                ...oldArray,
                { ...result.data(), connection_id: change.doc.id },
              ]);
            });
          }
        } else if (change.type === "removed") {
          if (change.doc.data().status === "pending") {
            setInpendingFriends((oldArray) =>
              oldArray.filter((item) => item.connection_id !== change.doc.id)
            );
          } else if (change.doc.data().status === "approved") {
            setApprovedFriends((oldArray) =>
              oldArray.filter((item) => item.connection_id !== change.doc.id)
            );
          }
        }
      });
    });
  };

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
        userInfo,
        setUserInfo,
        inpendingFriends,
        outpendingFriends,
        approvedFriends,
        newMessages,
      }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      primary: "#E40066",
      secondary: "#276fbf",
      background: "#fff",
      text: "#000",
      textSecondary: "#7a7a7a",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

function RootNavigator() {
  const { user, setUser, inpendingFriends, newMessages } = useContext(
    AuthenticatedUserContext
  );
  const { theme } = useContext(ThemeContext);
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
      {user ? (
        <NavigationTabs
          inpendingFriends={inpendingFriends}
          newMessages={newMessages}
          theme={theme}
        />
      ) : (
        <AuthenticationStack />
      )}
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
      <ThemeProvider>
        <AuthenticatedUserProvider>
          <RootNavigator />
        </AuthenticatedUserProvider>
      </ThemeProvider>
    </TailwindProvider>
  );
}
