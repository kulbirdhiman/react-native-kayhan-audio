import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";

type Props = {
  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: any;
  user: any;
  deviceDetails: any;
  onSuccess: () => void;
  onCancel?: () => void;
};

const API_BASE = "https://api.kayhanaudio.com.au";

export default function ZipPayButton({
  shippingAddress,
  billingAddress,
  productData,
  selectedShipping,
  discount,
  user,
  deviceDetails,
  onSuccess,
  onCancel,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const normalizedProducts = useMemo(() => {
    return (productData || []).map((item) => {
      const quantity = item?.quantity ?? item?.qty ?? 1;
      return {
        ...item,
        quantity,
        variations: Array.isArray(item?.variations) ? item.variations : [],
        regular_price: item?.regular_price ?? item?.price ?? 0,
        discount_price:
          item?.discount_price !== undefined ? item.discount_price : null,
        is_free: item?.is_free ?? 0,
        id: item?.id ?? item?.product_id,
        image:
          item?.image ??
          item?.images?.[0]?.image ??
          item?.images?.[0]?.url ??
          item?.images?.[0] ??
          null,
      };
    });
  }, [productData]);

  const handleZipPay = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const payload = {
        selectedShipping,
        user,
        shippingAddress,
        billingAddress,
        productData: normalizedProducts,
        discount,
        paymentMethod: 7, // ✅ IMPORTANT: send number (same as your working call)
        deviceDetails: deviceDetails ?? { ip: "0.0.0.0", type: Platform.OS },
      };

      const { data } = await axios.post(
        `${API_BASE}/v1/zip_pay/create-order`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data?.redirectUrl) {
        Alert.alert("Error", "No redirect URL returned from server");
        return;
      }

      await Linking.openURL(data.redirectUrl);
    } catch (error: any) {
      console.log("❌ ZipPay Error:", error?.response?.data || error?.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to start Zip Pay checkout"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("🔁 Deep link:", url);

      if (url.includes("payment-success")) onSuccess();
      if (url.includes("payment-cancel")) {
        Alert.alert("Payment Cancelled");
        onCancel?.();
      }
    });

    return () => sub.remove();
  }, [onSuccess, onCancel]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleZipPay}
        disabled={isProcessing}
        style={({ pressed }) => [
          styles.button,
          isProcessing && styles.buttonDisabled,
          pressed && !isProcessing && styles.buttonPressed,
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay with Zip</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#002d2d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "700" }, // ✅ white text
});
