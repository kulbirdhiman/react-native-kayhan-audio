import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNewgetRecommendedProductsQuery } from "store/api/home/HomeAPi";

// 🔗 CloudFront base
const IMG_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

export default function HotDeals() {
  const { data, isLoading, isError } =
    useNewgetRecommendedProductsQuery({});
  const navigation = useNavigation<any>();

  const products = data?.data?.result || [];

  if (isLoading) {
    return <Text style={{ padding: 16 }}>Loading hot deals...</Text>;
  }

  if (isError || products.length === 0) {
    return <Text style={{ padding: 16 }}>No hot deals available</Text>;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>🔥 Hot Deals</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {products.map((item: any) => {
          // 🖼 Image
          const imageUrl =
            item.images?.length > 0
              ? `${IMG_BASE_URL}${item.images[0].image}`
              : undefined;

          // 💰 Prices
          const price = Number(item.wholesale_price || item.regular_price);
          const mrp = Number(item.regular_price);

          const discount =
            mrp && price && mrp > price
              ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF`
              : null;

          return (
            <View key={item.id} style={styles.card}>
              {/* IMAGE */}
              <View style={styles.imageWrapper}>
                {imageUrl && (
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                )}

                {discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discount}</Text>
                  </View>
                )}
              </View>

              {/* DETAILS */}
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>${price}</Text>
                  {mrp > price && (
                    <Text style={styles.mrp}>${mrp}</Text>
                  )}
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { productId: item.slug })} style={styles.button}>
                  <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 16,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    width: 320,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
  },

  imageWrapper: {
    width: 130,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingVertical: 20,
  },

  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },

  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#E11D48",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },

  details: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },
  mrp: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
  },
});
