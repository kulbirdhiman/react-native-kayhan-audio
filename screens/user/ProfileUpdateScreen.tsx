import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "store/store";
import { logout } from "store/api/auth/authSlice";

const API_URL = "https://api.kayhanaudio.com.au/v1";

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchLastOrders();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/my_profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLastOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/order/my_orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allOrders = res.data?.data?.result || [];

      // 🔥 sort latest first + take last 5
      const lastFive = allOrders
        .sort((a: any, b: any) => b.id - a.id)
        .slice(0, 5);

      setOrders(lastFive);
    } catch (err) {
      console.log("Order fetch error", err);
    }
  };


  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.post(
              `${API_URL}/auth/logout`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.log("Logout API error", err);
          } finally {
            dispatch(logout());
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        {/* USER ICON */}
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("ProfileUpdate")}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* LAST 5 ORDERS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Last Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
              <Text style={styles.link}>Check All</Text>
            </TouchableOpacity>
          </View>

          {orders.length === 0 ? (
            <Text style={styles.emptyText}>No orders found</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View>
                  <Text style={styles.orderNumber}>
                    Order #{order.order_number}
                  </Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toDateString()}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    getStatusStyle(order.status),
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(order.status)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <MenuItem
            icon="settings"
            label="Profile Settings"
            onPress={() => navigation.navigate("ProfileUpdate")}
          />
        </View>
      </ScrollView>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------- COMPONENTS ---------- */

const MenuItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={20} color="#6a1b9a" />
    <Text style={styles.menuText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

/* ---------- HELPERS ---------- */

const getStatusLabel = (status: any) => {
  switch (status) {
    case 1:
      return "Paid";
    case 0:
      return "Pending";
    case 2:
      return "Failed";
    default:
      return "Unknown";
  }
};

const getStatusStyle = (status: any) => {
  switch (status) {
    case 1:
      return { backgroundColor: "#4caf50" };
    case 0:
      return { backgroundColor: "#ff9800" };
    case 2:
      return { backgroundColor: "#f44336" };
    default:
      return { backgroundColor: "#9e9e9e" };
  }
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },

  header: {
    height: 120,
    backgroundColor: "#6a1b9a",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -50,
    borderRadius: 16,
    alignItems: "center",
    padding: 20,
    elevation: 4,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#6a1b9a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  name: { fontSize: 18, fontWeight: "bold" },
  email: { color: "#666", marginTop: 4 },
  phone: { color: "#444", marginTop: 4 },

  editBtn: {
    flexDirection: "row",
    backgroundColor: "#6a1b9a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignItems: "center",
  },
  editText: { color: "#fff", marginLeft: 6 },

  section: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  link: { color: "#6a1b9a", fontWeight: "500" },

  orderItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderNumber: { fontWeight: "600" },
  orderDate: { color: "#777", fontSize: 12, marginTop: 2 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: "#fff", fontSize: 12 },

  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },

  menu: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
  },
  menuText: { flex: 1, marginLeft: 12, fontSize: 15 },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  logoutText: {
    color: "#ff3b30",
    fontWeight: "600",
    marginLeft: 6,
  },
});
