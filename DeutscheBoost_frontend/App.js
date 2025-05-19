// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

import TranslateScreen   from "./screens/TranslateScreen";
import HistoryScreen     from "./screens/HistoryScreen";
import PhrasesHome       from "./screens/PhrasesScreen";
import AddPhraseScreen   from "./screens/AddPhraseScreen";
import ReviewPhrasesScreen from "./screens/ReviewPhrasesScreen";

if (Platform.OS === "web") require("./css/web-scrollbar.css");

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ---- Phrases nested stack ---- */
function PhrasesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhrasesHome"   component={PhrasesHome} />
      <Stack.Screen name="AddPhrase"     component={AddPhraseScreen} />
      <Stack.Screen name="ReviewPhrases" component={ReviewPhrasesScreen} />
    </Stack.Navigator>
  );
}

/* ---- colors ---- */
const DARK_BG   = "#0e0c0c";
const BORDER_BG = "#1f2937";
const ICON_C    = "#f3f1f1";
const ICON_INAC = "#94a3b8";

/* ---- root component ---- */
export default function App() {
  /* Android system bars */
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(DARK_BG);
    NavigationBar.setBackgroundColorAsync(DARK_BG);
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: DARK_BG, borderTopColor: BORDER_BG },
          tabBarActiveTintColor:   ICON_C,
          tabBarInactiveTintColor: ICON_INAC,
          tabBarIcon: ({ focused, size }) => {
            const name =
              route.name === "Translate" ? (focused ? "language" : "language-outline") :
              route.name === "History"   ? (focused ? "time"     : "time-outline")     :
                                           (focused ? "book"     : "book-outline");
            return <Ionicons name={name} size={size} color={focused ? ICON_C : ICON_INAC} />;
          },
        })}
      >
        <Tab.Screen name="Translate" component={TranslateScreen} />
        <Tab.Screen name="History"   component={HistoryScreen} />
        <Tab.Screen name="Phrases"   component={PhrasesStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
