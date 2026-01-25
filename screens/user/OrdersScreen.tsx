import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const orders = [
  {
    id: "ORD001",
    date: "12 Jan 2026",
    total: "$120.00",
    status: "Delivered",
  },
  {
    id: "ORD002",
    date: "18 Jan 2026",
    total: "$85.50",
    status: "Processing",
  },
  {
    id: "ORD003",
    date: "20 Jan 2026",
    total: "$220.00",
    status: "Cancelled",
  },
];

export default function OrdersScreen() {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Total: {item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
    color: "#007AFF",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
});
