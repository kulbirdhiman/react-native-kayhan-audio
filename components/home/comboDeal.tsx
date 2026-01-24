import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const COMBO_DEALS = [
  {
    title: "Head Unit + Reverse Camera",
    price: "999",
    oldPrice: "1199",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1765889506754_MK1.png&w=2048&q=75",
  },
  {
    title: "Digital Cluster + Steering Wheel",
    price: "1499",
    oldPrice: "1799",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1768000097327_2.png&w=2048&q=75",
  },
];

export default function ComboDeals() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Combo Deals</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {COMBO_DEALS.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={styles.name}>{item.title}</Text>

            <Text style={styles.price}>
              ${item.price}{" "}
              <Text style={styles.oldPrice}>${item.oldPrice}</Text>
            </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Grab Deal</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    width: 220,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
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
