import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "screens/homeScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/checkoutScreen";

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
  Home: undefined;
  ProductList: undefined;
  ProductDetail: { product: Product };
  Cart: { product?: Product };
  Checkout: { product?: Product };
};

/* ---------- STACK ---------- */

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
