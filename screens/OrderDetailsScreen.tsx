import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

/* ---------------- CONSTANTS ---------------- */

const API_URL = "https://api.kayhanaudio.com.au/v1";

const PAYMENT_STATUS: any = {
  0: "Pending",
  1: "Paid",
  2: "Failed",
};

const PAYMENT_METHOD: any = {
  1: "Stripe",
  2: "PayPal",
};

/* ---------------- SCREEN ---------------- */

export default function OrderDetailsScreen({ route }: any) {
  const { orderId } = route.params;
  const { token } = useSelector((state: RootState) => state.auth);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  /* ---------------- API ---------------- */

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/order/user/detail/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrder(res.data?.data?.result || null);
    } catch (err) {
      console.log("Order detail fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  const billing = order.billing_address;
  const shipping = order.shipping_address;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------------- ORDER HEADER ---------------- */}
        <Text style={styles.title}>Order #{order.id}</Text>

        <View style={styles.card}>
          <Text>Status: {PAYMENT_STATUS[order.payment_status]}</Text>
          <Text>Payment: {PAYMENT_METHOD[order.payment_method]}</Text>
          <Text>Date: {new Date(order.created_at).toDateString()}</Text>
        </View>

        {/* ---------------- AMOUNT SUMMARY ---------------- */}
        <Text style={styles.subTitle}>Payment Summary</Text>
        <View style={styles.card}>
          <Text>Subtotal: ${order.sub_total}</Text>
          <Text>Shipping: ${order.shipping_charge}</Text>
          <Text>Discount: ${order.total_discount}</Text>
          <Text style={styles.total}>
            Total Paid: ${order.total_paid_value}
          </Text>
        </View>

        {/* ---------------- SHIPPING ADDRESS ---------------- */}
        <Text style={styles.subTitle}>Shipping Address</Text>
        <View style={styles.card}>
          <Text>{shipping?.name} {shipping?.last_name}</Text>
          <Text>{shipping?.street_address}</Text>
          <Text>
            {shipping?.city}, {shipping?.state?.name}
          </Text>
          <Text>
            {shipping?.country?.name} - {shipping?.postcode}
          </Text>
          <Text>Phone: {shipping?.phone}</Text>
          <Text>Email: {shipping?.email}</Text>
        </View>

        {/* ---------------- BILLING ADDRESS ---------------- */}
        <Text style={styles.subTitle}>Billing Address</Text>
        <View style={styles.card}>
          <Text>{billing?.name} {billing?.last_name}</Text>
          <Text>{billing?.street_address}</Text>
          <Text>
            {billing?.city}, {billing?.state?.name}
          </Text>
          <Text>
            {billing?.country?.name} - {billing?.postcode}
          </Text>
          <Text>Phone: {billing?.phone}</Text>
          <Text>Email: {billing?.email}</Text>
        </View>

        {/* ---------------- PRODUCTS ---------------- */}
        <Text style={styles.subTitle}>Products</Text>

        {order.products?.map((item: any) => (
          <View key={item.id} style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>
              Price: $
              {item.discount_price
                ? item.discount_price
                : item.regular_price}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#f6f6f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  total: { 
    marginTop: 6,
    fontWeight: "bold",
  },
  productCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  productName: {
    fontWeight: "600",
    marginBottom: 4,
  },
});
