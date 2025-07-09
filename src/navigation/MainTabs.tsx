import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BrowseRecipesScreen from '../screens/BrowseRecipesScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,   // hides the top header
        tabBarStyle: { display: 'none' }, // hides the bottom tab bar
      }}
    >
      <Tab.Screen name="Meals" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseRecipesScreen} />
      <Tab.Screen name="Shopping List" component={ShoppingListScreen} />
    </Tab.Navigator>
  );
}
