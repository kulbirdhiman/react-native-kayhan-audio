import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignUpScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/checkoutScreen";
import OrdersScreen from "../screens/user/OrdersScreen";

import BottomTabs from "./BottomTabs";

/* ---------- TYPES ---------- */
export type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  image: string;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;

  ProductDetail: { product: Product };
  Checkout: { product?: Product };
  Orders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator   
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
    >
      {/* AUTH */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* MAIN APP */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />

      {/* INNER SCREENS */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}
