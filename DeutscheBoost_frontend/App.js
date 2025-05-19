// app.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens (stub components – create separate files later)
function TranslateScreen() {
  return null; // TODO: build UI
}

function HistoryScreen() {
  return null; // TODO: build UI
}

function PhrasesScreen() {
  return null; // TODO: build UI
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (

    <NavigationContainer>

      <Tab.Navigator
      
        screenOptions={({ route }) => ({

          headerShown: false,

          tabBarIcon: ({ focused, size }) => {
            let iconName;
            if (route.name === 'Translate') {
              iconName = focused ? 'language' : 'language-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Phrases') {
              iconName = focused ? 'book' : 'book-outline';
            }
            return <Ionicons name={iconName} size={size} />;
          },

        })}
        
      >
        <Tab.Screen name="Translate" component={TranslateScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Phrases" component={PhrasesScreen} />

      </Tab.Navigator>

    </NavigationContainer>
  );
}