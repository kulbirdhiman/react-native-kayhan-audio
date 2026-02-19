import React, { useState, useMemo } from "react";
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
    { id: 0, label: "Standard Delivery", description: "4-7 Days" },
    { id: 1, label: "Local Pickup", description: "1-2 Days" },
  ];

  const normalizedProducts = useMemo(() => {
    return (productData || []).map((p) => ({
      cart_id: p.cart_id ?? Date.now(),
      product_id: Number(p.product_id ?? p.id ?? 0) || 0,
      quantity: Number(p.quantity ?? 1) || 1,
      name: p.name ?? "",
      slug: p.slug ?? "",
      weight: Number(p.weight ?? 0) || 0,
      variations: Array.isArray(p.variations) ? p.variations : [],
      images: Array.isArray(p.images) ? p.images : p.image ? [p.image] : [],
      regular_price: Number(p.regular_price ?? 0) || 0,
      discount_price: Number(p.discount_price ?? 0) || 0,
      price: Number(p.price ?? 0) || 0,
      department_id: Number(p.department_id ?? 0) || 0,
      category_id: Number(p.category_id ?? 0) || 0,
      model_id: Number(p.model_id ?? 0) || 0,
      is_free: p.is_free ?? 0,
    }));
  }, [productData]);

  const normalizedAddress = useMemo(() => {
    const a = shippingAddress;
    if (!a) return a;

    return {
      ...a,
      country: a.country
        ? {
            id: a.country?.id ?? null,
            name: a.country?.name ?? a.country_name ?? "",
            iso2: a.country?.iso2 ?? "",
            iso3: a.country?.iso3 ?? "",
          }
        : null,
      state: a.state
        ? {
            id: a.state?.id ?? null,
            name: a.state?.name ?? a.state_name ?? "",
            state_code: a.state?.state_code ?? "",
          }
        : null,
    };
  }, [shippingAddress]);

  const handleSelect = async (method: any) => {
    try {
      setLoadingMethod(method.id);

      if (method.id === 0) {
        const res = await getShippingPrice({
          products: normalizedProducts,
          shipping_address: normalizedAddress,
        }).unwrap();

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

      if (method.id === 1) {
        setShippingPrice(0);
        setSelectedShipping(method.id);
      }
    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || "Failed to calculate shipping price.");
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
            style={[styles.option, isSelected && styles.activeOption]}
            onPress={() => handleSelect(method)}
            disabled={isLoading}
          >
            <Ionicons
              name={isSelected ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={isSelected ? "#2563EB" : "#6B7280"}
            />

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.optionTitle}>{method.label}</Text>
              <Text style={styles.optionDesc}>{method.description}</Text>
            </View>

            {isLoading && <ActivityIndicator size="small" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", margin: 16, padding: 20, borderRadius: 22, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeOption: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  optionTitle: { fontSize: 15, fontWeight: "600" },
  optionDesc: { fontSize: 13, color: "#6B7280" },
});
