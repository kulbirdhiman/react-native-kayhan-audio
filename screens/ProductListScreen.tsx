import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useListProductForShopQuery } from "store/api/productApi";
import type { RootStackParamList } from "../navigation/StackNavigator";

const IMAGE_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/"; // Base URL for images

// type ProductListScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "ProductList"
// >;

export default function ProductListScreen() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products using RTK Query
  const { data, isLoading, isError, error } = useListProductForShopQuery({
    page: 1,
    limit: 15,
    search: debouncedSearch,
  });
  const products = data?.data?.result || [];

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: any) => {
    const image = item.images?.[0]?.image
      ? IMAGE_BASE_URL + item.images[0].image
      : "https://via.placeholder.com/220x220?text=No+Image";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetail", { productId: item.slug })}
      >
        {/* Heart Button */}
        <TouchableOpacity
          style={styles.heart}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={favorites.includes(item.id) ? "heart" : "heart-outline"}
            size={20}
            color={favorites.includes(item.id) ? "red" : "#000"}
          />
        </TouchableOpacity>

        {/* Product Image */}
        <Image source={{ uri: image }} style={styles.image} />

        {/* Product Info */}
        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>

          <View style={styles.priceRow}>
            {item.discount_price > 0 ? (
              <>
                <Text style={styles.price}>${item.discount_price}</Text>
                <Text style={styles.mrp}>${item.regular_price}</Text>
              </>
            ) : (
              <Text style={styles.price}>${item.regular_price}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading)
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (isError)
    return (
      <Text style={{ flex: 1, textAlign: "center", marginTop: 20 }}>
        Error loading products
      </Text>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search */}
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

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
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
  name: { fontSize: 13, color: "#555", marginVertical: 4 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 15, fontWeight: "700", marginRight: 6 },
  mrp: { fontSize: 13, color: "#888", textDecorationLine: "line-through", marginRight: 6 },
});
