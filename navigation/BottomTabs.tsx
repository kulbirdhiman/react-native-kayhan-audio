import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

import HomeScreen from "screens/homeScreen";
import ProductListScreen from "screens/ProductListScreen";
import CartScreen from "screens/CartScreen";
import ProfileUpdateScreen from "screens/user/ProfileUpdateScreen";
import LoginScreen from "screens/auth/LoginScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { token } = useSelector((state: RootState) => state.auth);
  // console.log(token , "this is token")
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 60, paddingBottom: 70 },
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            // case "Shop":
            //   iconName = focused ? "grid" : "grid-outline";
            //   break;
            case "Cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Account":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={ProductListScreen} />
      {/* <Tab.Screen name="Shop" component={ProductListScreen} /> */}
      <Tab.Screen name="Cart" component={CartScreen} />
      
      {/* Dynamic Account tab */}
      <Tab.Screen
        name="Account"
        component={token ? ProfileUpdateScreen : LoginScreen}
      />
    </Tab.Navigator>
  );
}
