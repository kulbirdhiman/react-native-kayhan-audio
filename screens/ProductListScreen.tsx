import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, Product } from "../navigation/StackNavigator";

const PRODUCTS: Product[] = [
  {
    id: 1,
    brand: "FG Falcon",
    name: "Rear Speaker Spacers (Pair)",
    price: 799,
    mrp: 1599,
    discount: 50,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1748522378145_13.png&w=2048&q=75",
  },
  {
    id: 2,
    brand: "Ford Territory SZ",
    name: "Premium Digital Instrument Cluster",
    price: 2999,
    mrp: 5999,
    discount: 50,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1768277590337_3-DSC07548.jpeg&w=2048&q=75",
  },
  {
    id: 3,
    brand: "Ford Territory",
    name: "Digital Cluster Pro Edition",
    price: 3499,
    mrp: 6999,
    discount: 50,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1768277590337_3-DSC07548.jpeg&w=2048&q=75",
  },
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductList"
>;

export default function ProductListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState("");

  const filteredProducts = PRODUCTS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetail", { product: item })
      }
    >
      <TouchableOpacity style={styles.heart}>
        <Ionicons name="heart-outline" size={20} />
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text numberOfLines={2} style={styles.name}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.mrp}>${item.mrp}</Text>
          <Text style={styles.discount}>{item.discount}% OFF</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search products"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#EEE" },
  headerTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  searchInput: { flex: 1, paddingVertical: 8, paddingLeft: 8 },

  card: { width: "48%", marginBottom: 16 },

  heart: {
    position: "absolute",
    zIndex: 10,
    right: 8,
    top: 8,
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },

  image: { width: "100%", height: 220, borderRadius: 6 },

  info: { paddingVertical: 8 },

  brand: { fontSize: 14, fontWeight: "700" },
  name: { fontSize: 13, color: "#555", marginVertical: 4 },

  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 15, fontWeight: "700", marginRight: 6 },
  mrp: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
  discount: { fontSize: 13, fontWeight: "700", color: "#FF3F6C" },
});
