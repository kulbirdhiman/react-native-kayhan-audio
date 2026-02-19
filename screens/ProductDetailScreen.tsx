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
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

import type { RootStackParamList } from "../navigation/StackNavigator";
import type { AppDispatch, RootState } from "store/store";
import { addToCart } from "store/actions/CartAction";
import { useProductDetailForShopQuery } from "store/api/product/productApi";

const IMAGE_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";
const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 1;
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
  const { width } = useWindowDimensions();

  const slug = (route.params as any)?.productId;

  const { data, isLoading, isError } =
    useProductDetailForShopQuery(slug);

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

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

  const isAlreadyInCart = cartItems.some(
    (item: any) => item.id === product.id
  );

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = () => {
    if (isAlreadyInCart) {
      navigation.navigate("Cart");
      return;
    }

    const regularPrice = Number(product.regular_price || 0);
    const discountPrice = Number(product.discount_price || 0);
    const finalPrice = discountPrice > 0 ? discountPrice : regularPrice;

    dispatch(
      addToCart({
        cart_id: Date.now(),

        product_id: product.id,
        name: String(product.name),
        slug: String(product.slug || ""),
        weight: Number(product.weight || 0),

        variations: [], // if you have variations later, set it here
        images: images || [],
        quantity: 1,

        regular_price: regularPrice,
        discount_price: discountPrice,
        price: finalPrice,

        department_id: Number(product.department_id || 0),
        category_id: Number(product.category_id || 0),
        model_id: Number(product.model_id || 0),
      })
    );
  };

  const handleBuyNow = () => {
    if (!isAlreadyInCart) {
      handleAddToCart();
    }
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.back} onPress={navigation.goBack}>
        <Ionicons name="arrow-back" size={22} color="#000" />
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
          setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {images.map((_: any, i: number) => (
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
          paddingBottom: BOTTOM_BAR_HEIGHT + 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>{String(product.brand || "")}</Text>
        <Text style={styles.name}>{String(product.name)}</Text>

        <Text style={styles.sku}>
          SKU: {product.sku || "N/A"}
        </Text>

        <View style={styles.priceBox}>
          <Text style={styles.finalPrice}>
            ${product.discount_price || product.regular_price}
          </Text>
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
            <RenderHTML
              contentWidth={width}
              source={{
                html:
                  product.description ||
                  "<p>No description available</p>",
              }}
              tagsStyles={htmlStyles}
            />
          )}

          {activeTab === "Specifications" && (
            <Text style={styles.text}>
              {product.specification
                ? String(product.specification.replace(/<[^>]+>/g, ""))
                : "No specifications available"}
            </Text>
          )}

          {activeTab === "Demo Video" && (
            <View style={styles.videoBox}>
              <Ionicons name="play-circle" size={60} color="#000" />
              <Text style={styles.videoText}>
                Demo video coming soon
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        {isAlreadyInCart ? (
          <TouchableOpacity
            style={[styles.buyBtn, { flex: 1 }]}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.buyText}>Go To Cart</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={handleAddToCart}
            >
              <Text style={styles.cartText}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyBtn}
              onPress={handleBuyNow}
            >
              <Text style={styles.buyText}>Buy Now</Text>
            </TouchableOpacity>
          </>
        )}
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
    marginTop: 40,
    resizeMode: "cover",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
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
  name: { fontSize: 22, fontWeight: "700", marginTop: 4 },

  sku: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
  },

  priceBox: { marginVertical: 10 },

  finalPrice: {
    fontSize: 26,
    fontWeight: "800",
  },

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

  bottomBar: {
    position: "absolute",
    bottom: 30,
    left: 12,
    right: 12,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 10,
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

const htmlStyles = {
  p: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    marginBottom: 8,
  },
};
