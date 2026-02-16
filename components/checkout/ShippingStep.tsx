import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetShippingPriceMutation } from "../../store/api/checkout/checkoutAPi";

interface Props {
  selectedShipping: number | null;
  setSelectedShipping: (i: number) => void;
  setShippingPrice: (price: number) => void;
  productData: any[];
  shippingAddress: any;
}

export default function ShippingStep({
  selectedShipping,
  setSelectedShipping,
  setShippingPrice,
  productData,
  shippingAddress,
}: Props) {
  const [getShippingPrice] = useGetShippingPriceMutation();
  const [loadingMethod, setLoadingMethod] = useState<number | null>(null);

  const methods = [
    {
      id: 0,
      label: "Standard Delivery",
      description: "4-7 Days",
    },
    {
      id: 1,
      label: "Local Pickup",
      description: "1-2 Days",
    },
  ];

  const handleSelect = async (method: any) => {
    try {
      setLoadingMethod(method.id);

      // ✅ STANDARD DELIVERY (API CALL)
      if (method.id === 0) {
        const res = await getShippingPrice({
          products: productData,
          shipping_address: shippingAddress,
        }).unwrap();

        console.log("Shipping API Response:", res);

        // ✅ Correct extraction based on your response shape
        const shippingCharge = res?.data?.data;

        if (typeof shippingCharge === "number" && shippingCharge >= 0) {
          setShippingPrice(shippingCharge);
          setSelectedShipping(method.id);
        } else {
          Alert.alert(
            "Shipping Not Available",
            "Shipping is not available for this address. Please choose Local Pickup."
          );
        }
      }

      // ✅ LOCAL PICKUP (NO API)
      if (method.id === 1) {
        setShippingPrice(0);
        setSelectedShipping(method.id);
      }
    } catch (error: any) {
      console.log("Shipping Error:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to calculate shipping price."
      );
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Shipping Method</Text>

      {methods.map((method) => {
        const isSelected = selectedShipping === method.id;
        const isLoading = loadingMethod === method.id;

        return (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.option,
              isSelected && styles.activeOption,
            ]}
            onPress={() => handleSelect(method)}
            disabled={isLoading}
          >
            <Ionicons
              name={
                isSelected
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={20}
              color={isSelected ? "#2563EB" : "#6B7280"}
            />

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.optionTitle}>
                {method.label}
              </Text>
              <Text style={styles.optionDesc}>
                {method.description}
              </Text>
            </View>

            {isLoading && (
              <ActivityIndicator size="small" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    margin: 16,
    padding: 20,
    borderRadius: 22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeOption: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
});
