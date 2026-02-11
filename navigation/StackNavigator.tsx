import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignUpScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/checkoutScreen";
import OrdersScreen from "../screens/user/OrdersScreen";
import BottomTabs from "./BottomTabs";
import CartScreen from "../screens/CartScreen";
import ProfileUpdateScreen from "screens/user/ProfileUpdateScreen";
import OrderDetailsScreen from "screens/OrderDetailsScreen";
import ProductScreen from "components/productScreen";
import ProductListScreen from "screens/ProductListScreen";
/* ---------- TYPES ---------- */
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  Cart: undefined;
  Search: undefined;

  // Product detail now receives slug
  ProductDetail: { slug: string };

  Checkout: { productId?: number };
  Orders: undefined;
  OrderDetails: { orderId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="Cart" component={CartScreen} />
      {/* <Stack.Screen name="Search" component={ProductListScreen} /> */}

      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}
