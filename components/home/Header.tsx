import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Kayhan Audio</Text>
      <Ionicons name="search" size={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  logo: { fontSize: 18, fontWeight: "700" },
});
