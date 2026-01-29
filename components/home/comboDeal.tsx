import React from "react";
import { useGetAllComboDealsQuery } from "../../store/api/home/comboDeals";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// 🔗 CloudFront base URL
const IMG_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

export default function ComboDeals() {
  const { data, isLoading, isError } = useGetAllComboDealsQuery({});

  if (isLoading) {
    return <Text style={{ padding: 16 }}>Loading combo deals...</Text>;
  }

  if (isError || !data?.success) {
    return <Text style={{ padding: 16 }}>Failed to load combo deals</Text>;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Combo Deals</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.data.map((item: any) => {
          // ✅ Main image
          const images = item.image ? JSON.parse(item.image) : [];
          const mainImage =
            images.length > 0
              ? `${IMG_BASE_URL}${images[0].image}`
              : undefined;

          // ✅ Sub product images
          const subImages = item.subproduct_images
            ? JSON.parse(item.subproduct_images)
            : [];

          return (
            <View key={item.id} style={styles.card}>
              {/* Main Image */}
              {mainImage && (
                <Image source={{ uri: mainImage }} style={styles.image} />
              )}

              {/* Product Name */}
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>

              {/* Sub product name */}
              {item.subproduct_name && (
                <Text style={styles.subProductName} numberOfLines={2}>
                  Includes: {item.subproduct_name}
                </Text>
              )}

              {/* Sub product images */}
              {subImages.length > 0 && (
                <View style={styles.subImagesRow}>
                  {subImages.map((img: any, index: number) => (
                    <Image
                      key={index}
                      source={{ uri: `${IMG_BASE_URL}${img.image}` }}
                      style={styles.subImage}
                    />
                  ))}
                </View>
              )}

              {/* Price */}
              <Text style={styles.price}>
                ${item.discount_price}{" "}
                <Text style={styles.oldPrice}>${item.price}</Text>
              </Text>

              {/* CTA */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Grab Deal</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    width: 240,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },
  name: {
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 14,
  },
  subProductName: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },
  subImagesRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  subImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 4,
  },
  price: {
    fontWeight: "700",
    marginBottom: 6,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
});
