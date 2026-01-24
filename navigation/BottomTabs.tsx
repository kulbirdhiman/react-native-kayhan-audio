import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "screens/homeScreen";
import ProductListScreen from "screens/ProductListScreen";
import CartScreen from "screens/CartScreen";
import ProfileUpdateScreen from "screens/user/ProfileUpdateScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 60,
          paddingBottom: 80,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Menu") iconName = focused ? "menu" : "menu-outline";
          else if (route.name === "Shop") iconName = focused ? "grid" : "grid-outline";
          else if (route.name === "Cart") iconName = focused ? "cart" : "cart-outline";
          else if (route.name === "Account")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={ProductListScreen} />
      <Tab.Screen name="Shop" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={ProfileUpdateScreen} />
    </Tab.Navigator>
  );
}
