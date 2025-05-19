// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as SystemUI      from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";

import TranslateScreen from "./screens/TranslateScreen";
import HistoryScreen   from "./screens/HistoryScreen";
import PhrasesScreen   from "./screens/PhrasesScreen";

const Tab = createBottomTabNavigator();
const DARK_BG   = "#0e0c0c";   // your slate-black
const BORDER_BG = "#1f2937";
const ICON_C    = "#f3f1f1";
const ICON_INAC = "#94a3b8";

export default function App() {
  /* ---- set system-UI colors once at mount ---- */
  useEffect(() => {
    // top status-bar
    SystemUI.setBackgroundColorAsync(DARK_BG);

    // bottom Android navigation-bar
    NavigationBar.setBackgroundColorAsync(DARK_BG);
    NavigationBar.setButtonStyleAsync("light");    // white back / home icons
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: DARK_BG,
            borderTopColor: BORDER_BG,
          },
          tabBarActiveTintColor: ICON_C,
          tabBarInactiveTintColor: ICON_INAC,
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            if (route.name === "Translate") {
              iconName = focused ? "language" : "language-outline";
            } else if (route.name === "History") {
              iconName = focused ? "time" : "time-outline";
            } else if (route.name === "Phrases") {
              iconName = focused ? "book" : "book-outline";
            }
            // force our own color so active/inactive both stay white(ish)
            return <Ionicons name={iconName} size={size} color={focused ? ICON_C : ICON_INAC} />;
          },
        })}
      >
        <Tab.Screen name="Translate" component={TranslateScreen} />
        <Tab.Screen name="History"   component={HistoryScreen} />
        <Tab.Screen name="Phrases"   component={PhrasesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
