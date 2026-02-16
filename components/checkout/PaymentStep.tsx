import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PayPalWebView from "./payment/PayPalWebView";

interface Props {
  selectedPayment: number;
  setSelectedPayment: (i: number) => void;
  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: number;
}

export default function PaymentStep({
  selectedPayment,
  setSelectedPayment,
  shippingAddress,
  billingAddress,
  productData,
  selectedShipping,
  discount,
}: Props) {
  const [showPaypal, setShowPaypal] = useState(false);

  const methods = [
    { id: 0, name: "Cash on Delivery" },
    { id: 1, name: "PayPal" },
  ];

  if (showPaypal) {
    return (
      <PayPalWebView
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        productData={productData}
        selectedShipping={selectedShipping}
        discount={discount}
        onSuccess={() => {
          setShowPaypal(false);
          alert("Payment Successful 🎉");
        }}
      />
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {methods.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.option}
          onPress={() => {
            setSelectedPayment(m.id);
            if (m.name === "PayPal") {
              setShowPaypal(true);
            }
          }}
        >
          <Ionicons
            name={
              selectedPayment === m.id
                ? "radio-button-on"
                : "radio-button-off"
            }
            size={20}
          />
          <Text style={styles.optionText}>{m.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 15,
  },
});
