import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const HOT_DEALS = [
  {
    name: "Android Head Unit",
    price: 799,
    mrp: 1149,
    discount: "30% OFF",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1765889506754_MK1.png&w=2048&q=75",
  },
  {
    name: "360° Camera System",
    price: 999,
    mrp: 1329,
    discount: "25% OFF",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1740993396573_360cam.jpg&w=2048&q=75",
  },
];

export default function HotDeals() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>🔥 Hot Deals</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {HOT_DEALS.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* LEFT - IMAGE */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
            </View>

            {/* RIGHT - DETAILS */}
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.mrp}>${item.mrp}</Text>
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

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

  /* CARD */
  card: {
    flexDirection: "row",
    width: 320,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    // Remove shadow
    // elevation: 4,
  },

  /* IMAGE SIDE */
  imageWrapper: {
    width: 130,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingVertical: 20, // increase height a bit
  },
  image: {
    width: 110,
    height: 110, // increase height
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

  /* DETAILS SIDE */
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
    color: "#000",
    marginRight: 8,
  },
  mrp: {
    fontSize: 13,
    color: "#888",
    textDecorationLine: "line-through",
  },

  /* BUTTON */
  button: {
    backgroundColor: "#000",
    paddingVertical: 12, // slightly bigger
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "700",
  },
});
