import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AfterpayWebView from "./payment/AfterpayWebView";

interface Props {
  selectedPayment: number;
  setSelectedPayment: (i: number) => void;

  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: number;
  user: any;
  deviceDetails: any;
}

export default function PaymentStep({
  selectedPayment,
  setSelectedPayment,
  shippingAddress,
  billingAddress,
  productData,
  selectedShipping,
  discount,
  user,
  deviceDetails,
}: Props) {
  const methods = [
    { id: 0, name: "Cash on Delivery" },
    { id: 1, name: "PayPal" },
    { id: 2, name: "Afterpay" },
  ];

  // 🔵 Show Afterpay WebView
  if (selectedPayment === 2) {
    return (
      <AfterpayWebView
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        productData={productData}
        selectedShipping={selectedShipping}
        discount={discount}
        user={user}
        deviceDetails={deviceDetails}
        onSuccess={() => {
          Alert.alert("Success 🎉", "Afterpay Payment Successful");
          setSelectedPayment(0); // reset back to default
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

            if (m.id === 0) {
              Alert.alert("Cash on Delivery Selected");
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
