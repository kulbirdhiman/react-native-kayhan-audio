import { View, Text, Image, StyleSheet } from "react-native";
import { CATEGORY_DATA } from "../../data/homedata";

export default function CategoriesSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Categories</Text>
      <View style={styles.grid}>
        {CATEGORY_DATA.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 16 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", alignItems: "center", marginBottom: 16 },
  image: { width: 120, height: 120, resizeMode: "contain" },
  text: { marginTop: 6, fontWeight: "600" },
});
