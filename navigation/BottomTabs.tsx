import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

import HomeScreen from "screens/homeScreen";
import ProductListScreen from "screens/ProductListScreen";
import CartScreen from "screens/CartScreen";
import ProfileUpdateScreen from "screens/user/ProfileUpdateScreen";
import LoginScreen from "screens/auth/LoginScreen";

import SearchMenu from "components/global/SearchMenu";

const Tab = createBottomTabNavigator();
const EmptyScreen = () => null; // 👈 dummy screen

export default function BottomTabNavigator() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: { height: 60, paddingBottom: 10 },
          tabBarIcon: ({ focused, color }) => {
            let iconName: any;

            switch (route.name) {
              case "Home":
                iconName = focused ? "home" : "home-outline";
                break;
              case "Search":
                iconName = focused ? "search" : "search-outline";
                break;
              case "Menu":
                iconName = focused ? "menu" : "menu-outline";
                break;
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

        {/* Normal Search */}
        <Tab.Screen name="Search" component={ProductListScreen} />

        {/* 👇 MENU TAB */}
        <Tab.Screen
          name="Menu"
          component={EmptyScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // stop navigation
              setMenuVisible(true); // open menu
            },
          }}
        />

        <Tab.Screen name="Cart" component={CartScreen} />

        <Tab.Screen
          name="Account"
          component={token ? ProfileUpdateScreen : LoginScreen}
        />
      </Tab.Navigator>

      {/* 🔽 SEARCH MENU */}
      <SearchMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
}
