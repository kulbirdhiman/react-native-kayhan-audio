import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type CartItemType = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  discount?: number;
};

const initialCartItems: CartItemType[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    qty: 1,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767939747660_30-DSC07429.jpg&w=2048&q=75",
    discount: 10,
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: 1599,
    qty: 2,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767934473607_5-DSC07531.jpg&w=2048&q=75",
    discount: 15,
  },
];

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);

  const increaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Amazon Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Image */}
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* Details */}
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.inStock}>In stock</Text>

              <Text style={styles.price}>
                ₹{item.price * item.qty}
              </Text>

              {/* Qty Row */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{item.qty}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>

              {/* Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
                <Text style={styles.divider}>|</Text>
                <TouchableOpacity>
                  <Text style={styles.actionText}>Save for later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Amazon Checkout Bar */}
      {cartItems.length > 0 && (
        <View style={styles.checkoutBar}>
          <Text style={styles.subtotal}>
            Subtotal ({cartItems.length} items):{" "}
            <Text style={styles.subtotalPrice}>₹{totalPrice}</Text>
          </Text>

          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>Proceed to Buy</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEDED", // Amazon background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 14,
    elevation: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 16,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 14,
    margin: 10,
    borderRadius: 6,
  },

  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  inStock: {
    color: "#007600",
    marginTop: 4,
    fontSize: 13,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  qtyBtn: {
    borderWidth: 1,
    borderColor: "#D5D9D9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },

  qtyValue: {
    marginHorizontal: 12,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },

  actionText: {
    color: "#007185",
    fontSize: 13,
  },

  divider: {
    marginHorizontal: 8,
    color: "#999",
  },

  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    elevation: 12,
  },

  subtotal: {
    fontSize: 16,
    marginBottom: 10,
  },

  subtotalPrice: {
    fontWeight: "800",
  },

  checkoutBtn: {
    backgroundColor: "#FFD814", // Amazon yellow
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
