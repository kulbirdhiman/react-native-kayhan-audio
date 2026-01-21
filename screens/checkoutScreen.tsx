import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CART_ITEMS = [
  {
    id: 1,
    name: "Digital Instrument Cluster",
    price: 2999,
    qty: 1,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1768277590337_3-DSC07548.jpeg&w=2048&q=75",
  },
  {
    id: 2,
    name: "Speaker Spacer Kit",
    price: 799,
    qty: 2,
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1748522378145_13.png&w=2048&q=75",
  },
];

export default function CheckoutScreen() {
  const [step, setStep] = useState(1);

  const subtotal = CART_ITEMS.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {["Address", "Shipping", "Payment"].map((label, i) => (
          <View
            key={i}
            style={[
              styles.stepPill,
              step === i + 1 && styles.activeStep,
            ]}
          >
            <Text
              style={[
                styles.stepText,
                step === i + 1 && styles.activeStepText,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {CART_ITEMS.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.qty}>Qty {item.qty}</Text>
              </View>

              <Text style={styles.price}>₹{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Address */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>

            <View style={styles.row}>
              <TextInput placeholder="First Name" style={styles.input} />
              <TextInput placeholder="Last Name" style={styles.input} />
            </View>

            <TextInput placeholder="Email" style={styles.input} />
            <TextInput placeholder="Phone" style={styles.input} />
            <TextInput placeholder="Street Address" style={styles.input} />
            <TextInput placeholder="City" style={styles.input} />
            <TextInput placeholder="Postcode" style={styles.input} />
          </View>
        )}

        {/* Shipping */}
        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Shipping Method</Text>

            {["Standard Delivery (Free)", "Express Delivery ₹10"].map(
              (m, i) => (
                <TouchableOpacity key={i} style={styles.option}>
                  <Ionicons
                    name={
                      i === 0
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.optionText}>{m}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        )}

        {/* Payment */}
        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            {["Cash on Delivery", "UPI", "Card"].map((p, i) => (
              <TouchableOpacity key={i} style={styles.option}>
                <Ionicons
                  name={
                    i === 0
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color="#000"
                />
                <Text style={styles.optionText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Price */}
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text>Subtotal</Text>
            <Text>₹{subtotal}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{subtotal}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cta}
          onPress={() =>
            step < 3 ? setStep(step + 1) : alert("Order Placed 🎉")
          }
        >
          <Text style={styles.ctaText}>
            {step < 3 ? "Continue" : "Pay Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#FFF",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },

  steps: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },

  stepPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 6,
  },

  activeStep: { backgroundColor: "#000" },
  activeStepText: { color: "#FFF" },

  stepText: { fontSize: 13, fontWeight: "600" },

  card: {
    backgroundColor: "#FFF",
    margin: 12,
    padding: 18,
    borderRadius: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  image: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },

  productName: { fontSize: 14, fontWeight: "600" },

  qty: { fontSize: 12, color: "#777" },

  price: { fontSize: 15, fontWeight: "700" },

  row: { flexDirection: "row" },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flex: 1,
    marginRight: 6,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  optionText: { marginLeft: 12, fontSize: 15 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  totalText: { fontSize: 18, fontWeight: "800" },

  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },

  cta: {
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  ctaText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
 