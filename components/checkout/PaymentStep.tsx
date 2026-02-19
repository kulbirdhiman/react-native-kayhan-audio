// ✅ PaymentStep.tsx (UPDATED - select first, Pay Now starts payment)

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AfterpayWebView from "./payment/AfterpayWebView";
import ZipPayButton from "./payment/ZipPayButton";
import PayPalWebView from "./payment/PayPalWebView";

interface Props {
  selectedPayment: number;
  setSelectedPayment: (i: number) => void;

  // ✅ NEW
  startPayment: boolean;
  onPaid: () => void;
  onCancel: () => void;

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
  startPayment,
  onPaid,
  onCancel,
  shippingAddress,
  billingAddress,
  productData,
  selectedShipping,
  discount,
  user,
  deviceDetails,
}: Props) {
  const methods = [
    { id: 1, name: "PayPal" },
    { id: 2, name: "Afterpay" },
    { id: 3, name: "Zip Pay" },
  ];

  // ✅ Only start payment UI when Pay Now is clicked
  if (startPayment) {
    if (selectedPayment === 1) {
      return (
        <PayPalWebView
          shippingAddress={shippingAddress}
          billingAddress={billingAddress}
          productData={productData}
          selectedShipping={selectedShipping}
          discount={discount}
          user={user}
          deviceDetails={deviceDetails}
          onSuccess={onPaid}
          onCancel={onCancel}
        />
      );
    }

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
          onSuccess={onPaid}
        />
      );
    }

    if (selectedPayment === 3) {
      return (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Zip Pay</Text>
          <ZipPayButton
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            productData={productData}
            selectedShipping={selectedShipping}
            discount={discount}
            user={user}
            deviceDetails={deviceDetails}
            onSuccess={onPaid}
            onCancel={onCancel}
          />
        </View>
      );
    }
  }

  // default: show list
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {methods.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.option}
          onPress={() => setSelectedPayment(m.id)}
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

      {selectedPayment === 0 && (
        <Text style={styles.note}>Select a payment method, then press Pay Now.</Text>
      )}

      {selectedPayment !== 0 && (
        <Text style={styles.note}>
          Selected: {methods.find((x) => x.id === selectedPayment)?.name}
        </Text>
      )}
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
  note: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
  },
});
