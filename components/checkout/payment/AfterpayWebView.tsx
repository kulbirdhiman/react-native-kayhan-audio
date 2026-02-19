import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Platform } from "react-native";
import axios from "axios";

interface Props {
  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: any;
  user: any;
  deviceDetails: any;
  onSuccess: () => void;
}

export default function AfterpayWebView({
  shippingAddress,
  billingAddress,
  productData,
  selectedShipping,
  discount,
  user,
  deviceDetails,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(true);

  const createOrder = async () => {
    try {
      setLoading(true);

      const normalizedProducts = (productData || []).map((item) => {
        const quantity = item?.quantity ?? item?.qty ?? 1;

        return {
          ...item,
          // ✅ backend required
          quantity,
          variations: Array.isArray(item?.variations) ? item.variations : [],

          // ✅ backend pricing fields
          regular_price: item?.regular_price ?? item?.price ?? 0,
          discount_price:
            item?.discount_price !== undefined ? item.discount_price : null,

          // ✅ optional fields
          is_free: item?.is_free ?? 0,

          // optional mapping
          id: item?.id ?? item?.product_id,
          image:
            item?.image ??
            item?.images?.[0]?.image ??
            item?.images?.[0]?.url ??
            item?.images?.[0] ??
            null,
        };
      });

      // ✅ IMPORTANT: backend expects device_detail
      const payload = {
        selectedShipping,
        user,
        shippingAddress,
        billingAddress,
        productData: normalizedProducts,
        discount,
        payment_method: "afterpay",
        deviceDetails: deviceDetails ?? { ip: "0.0.0.0", type: Platform.OS },
      };

      console.log("📦 Payload:", payload);

      const { data } = await axios.post(
        "https://api.kayhanaudio.com.au/v1/after_pay/create-order",
        payload
      );

      console.log("✅ Response:", data);

      if (!data?.redirectUrl) {
        Alert.alert("Error", "No redirect URL returned from server");
        return;
      }

      // ✅ Open Afterpay in browser (works better than WebView)
      const url = data.redirectUrl;
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert("Error", "Cannot open Afterpay checkout URL");
        return;
      }

      await Linking.openURL(url);
    } catch (error: any) {
      console.log("❌ ERROR:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create Afterpay order"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Listen for deep-link return from Afterpay (needs backend returnUrl = yourapp://payment-success)
  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("🔁 Deep link:", url);

      if (url.includes("payment-success")) {
        onSuccess();
      }

      if (url.includes("payment-cancel")) {
        Alert.alert("Payment Cancelled");
      }
    });

    createOrder();

    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  // no WebView now
  return null;
}
