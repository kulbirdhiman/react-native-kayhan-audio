import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import type { RootStackParamList } from "../navigation/StackNavigator";
import { useProductDetailForShopQuery } from "store/api/productApi";
import type { AppDispatch } from "store/store";
import { addToCart } from "store/actions/CartAction";

const IMAGE_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";
const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.6;
const BOTTOM_BAR_HEIGHT = 70;

const TABS = ["Description", "Specifications", "Demo Video"];

type RouteProps = RouteProp<RootStackParamList, "ProductDetail">;
type NavProps = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

export default function ProductDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const dispatch = useDispatch<AppDispatch>();

  const slug = (route.params as any)?.productId;
  const { data, isLoading, isError } =
    useProductDetailForShopQuery(slug);

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (isError || !data?.data?.result) {
    return (
      <View style={styles.center}>
        <Text>Failed to load product</Text>
      </View>
    );
  }

  const product = data.data.result;

  const images =
    product.images?.length > 0
      ? product.images.map((i: any) => IMAGE_BASE_URL + i.image)
      : product.image
      ? [IMAGE_BASE_URL + product.image]
      : [];

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discount_price || product.regular_price,
        image: images[0],
        qty: 1,
      })
    );

    Alert.alert("✅ Added to Cart", product.name);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.back} onPress={navigation.goBack}>
        <Ionicons name="arrow-back" size={22} />
      </TouchableOpacity>

      {/* Image Slider */}
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        style={{ height: IMAGE_HEIGHT }}
        onMomentumScrollEnd={(e) =>
          setActiveImage(
            Math.round(e.nativeEvent.contentOffset.x / width)
          )
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {images.map((_:any, i:any) => (
          <View
            key={i}
            style={[styles.dot, activeImage === i && styles.activeDot]}
          />
        ))}
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: BOTTOM_BAR_HEIGHT + 20, // 🔥 important
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.regular_price}</Text>
          {product.discount_price && (
            <>
              <Text style={styles.mrp}>
                ${product.discount_price}
              </Text>
              <Text style={styles.discount}>
                {Math.round(
                  ((product.regular_price - product.discount_price) /
                    product.regular_price) *
                    100
                )}
                % OFF
              </Text>
            </>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "Description" && (
            <Text style={styles.text}>
              {product.description || "No description available"}
            </Text>
          )}

          {activeTab === "Specifications" && (
            <Text style={styles.text}>
              {product.specification
                ? product.specification.replace(/<[^>]+>/g, "")
                : "No specifications available"}
            </Text>
          )}

          {activeTab === "Demo Video" && (
            <View style={styles.videoBox}>
              <Ionicons name="play-circle" size={60} />
              <Text style={styles.videoText}>
                Demo video coming soon
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 🔥 FIXED BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <Text style={styles.buyText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  back: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },

  image: {
    width,
    // height: IMAGE_HEIGHT,
    resizeMode: "contain",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#000" },

  content: { padding: 16 },

  brand: { fontSize: 15, fontWeight: "700" },
  // name: { fontSize: 22,color: "#555", marginVertical: 6 ,  },
  name: { 
  fontSize: 22,
  color: "#0000",
  marginVertical: 6,
  fontWeight: "700", // <-- makes it bold
},


  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 20, fontWeight: "800", marginRight: 8 , },
  mrp: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discount: { color: "#ff3f6c", fontWeight: "700" },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginTop: 20,
  },
  tab: { marginRight: 20, paddingVertical: 10 },
  activeTab: { borderBottomWidth: 2 },
  tabText: { color: "#777" },
  activeTabText: { color: "#000", fontWeight: "700" },

  tabContent: { marginTop: 16 },
  text: { fontSize: 14, lineHeight: 22, color: "#555" },

  videoBox: { alignItems: "center", marginTop: 30 },
  videoText: { marginTop: 8, color: "#777" },

  /* 🔥 FIXED POSITION */
  bottomBar: {
    position: "absolute",
    bottom: 30 , 
    left: 12,
    right: 12,

    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,

    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    zIndex: 100,
  },

  cartBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  buyBtn: {
    flex: 1,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
  },
  cartText: { textAlign: "center", fontWeight: "700" },
  buyText: { textAlign: "center", fontWeight: "700", color: "#fff" },
});
