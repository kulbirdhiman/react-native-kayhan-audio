import React, { useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  increaseQty,
  decreaseQty,
  removeItem,
} from "../store/actions/CartAction";

export default function CartScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get cart items from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = useMemo(() => {
    return (cartItems || []).reduce((sum: number, item: any) => {
      const qty = Number(item.quantity ?? item.qty ?? 1) || 1;
      const price = Number(item.price) || 0;
      return sum + price * qty;
    }, 0);
  }, [cartItems]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      {/* ================= EMPTY CART ================= */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#999" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven’t added anything yet
          </Text>

          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ================= CART ITEMS ================= */
        <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
          {cartItems.map((item: any, idx: number) => {
            const productId = item.product_id ?? item.id; // fallback
            const qty = Number(item.quantity ?? item.qty ?? 1) || 1;

            // ✅ image priority: item.image -> images[0] -> images[0].image
            const img =
              item.image ??
              item.images?.[0]?.image ??
              item.images?.[0]?.url ??
              item.images?.[0] ??
              null;

            return (
              <View key={productId ?? item.cart_id ?? idx} style={styles.card}>
                {/* Image */}
                <Image
                  source={{ uri: img || "https://via.placeholder.com/90" }}
                  style={styles.image}
                />

                {/* Details */}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>

                  {item.is_free == 1 ? (
                    <Text style={[styles.inStock, { color: "#16a34a" }]}>
                      Free item 🎁
                    </Text>
                  ) : (
                    <Text style={styles.inStock}>In stock</Text>
                  )}

                  <Text style={styles.price}>₹{(Number(item.price) || 0) * qty}</Text>

                  {/* Quantity */}
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => dispatch(decreaseQty(productId))}
                      disabled={qty === 1}
                    >
                      <Text>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyValue}>{qty}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => dispatch(increaseQty(productId))}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => dispatch(removeItem(productId))}>
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>

                    <Text style={styles.divider}>|</Text>

                    <TouchableOpacity>
                      <Text style={styles.actionText}>Save for later</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ================= CHECKOUT BAR ================= */}
      {cartItems.length > 0 && (
        <View style={styles.checkoutBar}>
          <Text style={styles.subtotal}>
            Subtotal ({cartItems.length} items):{" "}
            <Text style={styles.subtotalPrice}>₹{totalPrice}</Text>
          </Text>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.checkoutText}>Proceed to Buy</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAEDED" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 14,
    elevation: 4,
  },

  headerTitle: { fontSize: 18, fontWeight: "700", marginLeft: 16 },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 14,
    margin: 10,
    borderRadius: 6,
  },

  image: { width: 90, height: 90, resizeMode: "contain" },

  details: { flex: 1, marginLeft: 12 },

  name: { fontSize: 15, fontWeight: "600", color: "#111" },

  inStock: { color: "#007600", marginTop: 4, fontSize: 13 },

  price: { fontSize: 18, fontWeight: "700", marginTop: 6 },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  qtyBtn: {
    borderWidth: 1,
    borderColor: "#D5D9D9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },

  qtyValue: { marginHorizontal: 12, fontWeight: "600" },

  actionRow: { flexDirection: "row", marginTop: 10, alignItems: "center" },

  actionText: { color: "#007185", fontSize: 13 },

  divider: { marginHorizontal: 8, color: "#999" },

  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    elevation: 12,
  },

  subtotal: { fontSize: 16, marginBottom: 10 },

  subtotalPrice: { fontWeight: "800" },

  checkoutBtn: {
    backgroundColor: "#FFD814",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  checkoutText: { fontSize: 16, fontWeight: "700" },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 8,
  },

  emptyTitle: { fontSize: 20, fontWeight: "700", marginTop: 16 },

  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },

  shopBtn: {
    marginTop: 20,
    backgroundColor: "#FFD814",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  shopText: { fontSize: 15, fontWeight: "700" },
});
