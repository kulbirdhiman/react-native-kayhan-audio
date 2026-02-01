import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

/* ---------------- CONSTANTS ---------------- */

const API_URL = "https://api.kayhanaudio.com.au/v1";

export const PAYMENT_STATUS = {
  pending: 0,
  paid: 1,
  failed: 2,
};

/* ---------------- SCREEN ---------------- */

export default function OrdersScreen({ navigation }: any) {
  const { token } = useSelector((state: RootState) => state.auth);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- API CALL ---------------- */

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/order/my_orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data?.data?.result || []);
    } catch (err) {
      console.log("Orders fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getStatusLabel = (status: number) => {
    switch (status) {
      case PAYMENT_STATUS.paid:
        return "Paid";
      case PAYMENT_STATUS.pending:
        return "Pending";
      case PAYMENT_STATUS.failed:
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case PAYMENT_STATUS.paid:
        return "#4caf50";
      case PAYMENT_STATUS.pending:
        return "#ff9800";
      case PAYMENT_STATUS.failed:
        return "#f44336";
      default:
        return "#999";
    }
  };

  /* ---------------- RENDER ITEM ---------------- */

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("OrderDetails", { orderId: item.id })
      }
    >
      <View style={styles.row}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text
          style={[
            styles.status,
            { color: getStatusColor(item.payment_status) },
          ]}
        >
          {getStatusLabel(item.payment_status)}
        </Text>
      </View>

      <Text style={styles.text}>
        Date: {new Date(item.created_at).toDateString()}
      </Text>

      <Text style={styles.text}>
        Total: ${item.total_paid_value}
      </Text>
    </TouchableOpacity>
  );

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
