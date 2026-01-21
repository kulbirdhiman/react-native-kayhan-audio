import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "../navigation/StackNavigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RouteProps = RouteProp<RootStackParamList, "ProductDetail">;
type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

const { width } = Dimensions.get("window");
const TABS = ["Description", "Specifications", "Demo Video"];

export default function ProductDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { product } = route.params;

  const [activeTab, setActiveTab] = useState("Description");
  const [activeImage, setActiveImage] = useState(0);

  const images = [product.image, product.image, product.image];

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>

      {/* Image Gallery */}
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
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
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeImage === i && styles.activeDot]}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.mrp}>${product.mrp}</Text>
          <Text style={styles.discount}>{product.discount}% OFF</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
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

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "Description" && (
            <Text style={styles.text}>
              Premium aftermarket product designed for OEM fitment,
              durability, and seamless integration.
            </Text>
          )}

          {activeTab === "Specifications" && (
            <>
              <Text style={styles.list}>• Plug & Play Installation</Text>
              <Text style={styles.list}>• OEM Quality Finish</Text>
              <Text style={styles.list}>• ABS Material</Text>
              <Text style={styles.list}>• 12 Months Warranty</Text>
            </>
          )}

          {activeTab === "Demo Video" && (
            <View style={styles.videoBox}>
              <Ionicons name="play-circle" size={60} />
              <Text style={styles.videoText}>Demo video coming soon</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate("Cart", { product })}
        >
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => navigation.navigate("Checkout", { product })}
        >
          <Text style={styles.buyText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  back: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 20,
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },

  image: { width, height: 320 },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CCC",
    marginHorizontal: 4,
  },

  activeDot: { backgroundColor: "#000" },

  content: { flex: 1, padding: 16 },

  brand: { fontSize: 16, fontWeight: "700" },
  name: { fontSize: 15, color: "#555", marginVertical: 6 },

  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { fontSize: 20, fontWeight: "700", marginRight: 8 },
  mrp: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discount: { fontSize: 14, fontWeight: "700", color: "#FF3F6C" },

  tabs: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },

  tab: { paddingVertical: 10, marginRight: 20 },
  activeTab: { borderBottomWidth: 2, borderColor: "#000" },
  tabText: { color: "#777" },
  activeTabText: { color: "#000", fontWeight: "700" },

  tabContent: { marginTop: 16 },
  text: { fontSize: 14, color: "#555", lineHeight: 22 },
  list: { fontSize: 14, marginBottom: 6 },

  videoBox: { alignItems: "center", marginTop: 30 },
  videoText: { marginTop: 10, color: "#777" },

  bottomBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },

  cartBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 14,
    borderRadius: 6,
    marginRight: 10,
  },

  buyBtn: {
    flex: 1,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 6,
  },

  cartText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#000",
  },

  buyText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#FFF",
  },
});
