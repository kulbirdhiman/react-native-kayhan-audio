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
import { useListProductForShopQuery } from "store/api/product/productApi";
import { useGetDepartmentsQuery } from "store/api/category/departmentApi";
import ProductFilterSidebar from "components/products/ProductFilterSidebar";

const IMAGE_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

export default function ProductListScreen() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 🔥 FILTER STATES
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{
    company: number | null;
    model: number | null;
    year: string | null;
  }>({
    company: null,
    model: null,
    year: null,
  });

  // ---------------- DEBOUNCE SEARCH ----------------
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // ---------------- FETCH CATEGORIES ----------------
  const { data: deptData, isLoading: isDeptLoading } =
    useGetDepartmentsQuery();
  const categories = deptData?.data?.result || [];
  console.log(selectedCategory, filters, "this is")
  // ---------------- FETCH PRODUCTS ----------------
  const { data, isLoading, isError } = useListProductForShopQuery({
    page: 1,
    limit: 65,
    search: debouncedSearch,
    category: selectedCategory,
    company: filters.company,
    model: filters.model,
    year: filters.year,
  });

  const products = data?.data?.result || [];

  // ---------------- FAVORITES ----------------
  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // ---------------- RENDER PRODUCT ITEM ----------------
  const renderItem = ({ item }: any) => {
    const image = item.images?.[0]?.image
      ? IMAGE_BASE_URL + item.images[0].image
      : "https://via.placeholder.com/220x220?text=No+Image";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item.slug })
        }
      >
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

        <Image source={{ uri: image }} style={styles.image} />

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

  // ---------------- LOADING / ERROR ----------------
  if (isLoading || isDeptLoading)
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (isError)
    return (
      <Text style={{ flex: 1, textAlign: "center", marginTop: 20 }}>
        Error loading products
      </Text>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}><TouchableOpacity
            onPress={() => navigation.goBack()}
            // style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>   Products</Text>

          {/* 🔥 FILTER BUTTON */}
          <TouchableOpacity onPress={() => setFiltersOpen(() => !filtersOpen)}>
            <Ionicons name="filter" size={22} />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search products"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* CATEGORIES */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.slug.toString()}
          contentContainerStyle={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.slug && styles.categorySelected,
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === item.slug ? null : item.slug
                )
              }
            >
              <Text
                style={{
                  color: selectedCategory === item.slug ? "#FFF" : "#333",
                  fontWeight: "500",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
      />

      {/* 🔥 FILTER SIDEBAR */}
      <ProductFilterSidebar
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={(payload) => {
          setFilters(payload);
          setFiltersOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#EEE" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  searchInput: { flex: 1, paddingVertical: 8, paddingLeft: 8 },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#EEE",
    borderRadius: 20,
    marginRight: 8,
  },
  categorySelected: { backgroundColor: "#007bff" },
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
  mrp: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 6,
  },
});