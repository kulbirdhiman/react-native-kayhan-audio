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
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useListProductForShopQuery } from "store/api/productApi";
import CarModelPicker from "components/global/CarModelPicker";

const IMAGE_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

export default function ProductListScreen() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // ---------------- FILTER STATES ----------------
  const [filterVisible, setFilterVisible] = useState(false);
  const [category, setCategory] = useState(""); // can map to Make
  const [company, setCompany] = useState(""); // optional
  const [model, setModel] = useState(""); // Model slug
  const [year, setYear] = useState(""); // Year string
  const [limit, setLimit] = useState(15);

  // ---------------- DEBOUNCE SEARCH ----------------
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // ---------------- FETCH PRODUCTS ----------------
  const { data, isLoading, isError } = useListProductForShopQuery({
    page: 1,
    limit,
    search: debouncedSearch,
    category,
    company,
    model,
    // year,
  });

  const products = data?.data?.result || [];

  // ---------------- FAVORITES ----------------
  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // ---------------- APPLY FILTERS ----------------
  const applyFilters = () => setFilterVisible(false);

  // ---------------- RENDER PRODUCT ITEM ----------------
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

  // ---------------- LOADING / ERROR ----------------
  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
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
        <Text style={styles.headerTitle}>Products</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#666" />
            <TextInput
              placeholder="Search products"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="funnel-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
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

      {/* FILTER MODAL */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            <ScrollView>
              {/* CATEGORY */}
              <Text style={styles.label}>Category / Make</Text>
              <TextInput
                placeholder="Enter category slug"
                style={styles.input}
                value={category}
                onChangeText={setCategory}
              />

              {/* COMPANY */}
              <Text style={styles.label}>Company</Text>
              <TextInput
                placeholder="Enter company slug"
                style={styles.input}
                value={company}
                onChangeText={setCompany}
              />

              {/* CAR MODEL PICKER */}
              <Text style={styles.label}>Car Model & Year</Text>
              <CarModelPicker
                onSelect={({ make, model: m, submodel, year: y }) => {
                  setCategory(make); // map to category
                  setModel(m);
                  setYear(y || "");
                }}
              />

              {/* PRODUCTS PER PAGE */}
              <Text style={styles.label}>Products per page</Text>
              <TextInput
                placeholder="Limit"
                style={styles.input}
                value={limit.toString()}
                onChangeText={text => setLimit(Number(text))}
                keyboardType="numeric"
              />

              {/* APPLY BUTTON */}
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>

              {/* CLOSE BUTTON */}
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setFilterVisible(false)}
              >
                <Text style={styles.applyText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
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
    flex: 1,
  },
  searchInput: { flex: 1, paddingVertical: 8, paddingLeft: 8 },
  filterBtn: { backgroundColor: "#000", padding: 8, marginLeft: 8, borderRadius: 8 },
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" },
  modalContent: { backgroundColor: "#FFF", margin: 20, borderRadius: 8, padding: 16, maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 14, marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#DDD", borderRadius: 6, padding: 10, marginTop: 4 },
  applyBtn: { backgroundColor: "#000", padding: 12, borderRadius: 6, marginTop: 12, alignItems: "center" },
  applyText: { color: "#FFF", fontWeight: "700" },
});
