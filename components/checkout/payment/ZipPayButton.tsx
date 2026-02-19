import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Platform } from "react-native";
import axios from "axios";

interface Props {
  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: any; // can be null | {} | { coupon_code: string, ... }
  user: any; // can be null | {}
  deviceDetails: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ZipPayWebView({
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
  const [loading, setLoading] = useState(true);

  const createOrder = async () => {
    try {
      setLoading(true);

      const normalizedProducts = (productData || []).map((item) => {
        const quantity = item?.quantity ?? item?.qty ?? 1;

        return {
          ...item,
          quantity,
          variations: Array.isArray(item?.variations) ? item.variations : [],
          regular_price: item?.regular_price ?? item?.price ?? 0,
          discount_price:
            item?.discount_price !== undefined ? item.discount_price : 0,
          id: item?.id ?? item?.product_id,
          image:
            item?.image ??
            item?.images?.[0]?.image ??
            item?.images?.[0]?.url ??
            item?.images?.[0] ??
            null,
        };
      });

      // ✅ make sure user is either real object or null (not {})
      const safeUser = user && Object.keys(user).length > 0 ? user : null;

      // ✅ make sure discount is either valid coupon object or empty {}
      const safeDiscount =
        discount &&
        typeof discount === "object" &&
        Object.keys(discount).length > 0 &&
        (discount.coupon_code ? true : false)
          ? discount
          : {};

      const payload = {
        selectedShipping,
        user: safeUser,
        shippingAddress,
        billingAddress,
        productData: normalizedProducts,

        // ✅ IMPORTANT: same as Afterpay behavior
        discount: safeDiscount,

        // ✅ IMPORTANT: use underscore like Afterpay
        payment_method: 7,

        deviceDetails:
          deviceDetails && Object.keys(deviceDetails).length > 0
            ? deviceDetails
            : { ip: "0.0.0.0", type: Platform.OS },
      };

      console.log("📦 ZipPay Payload:", payload);

      const { data } = await axios.post(
        "http://192.168.1.39:5002/v1/zip_pay/create-order",
        payload
      );

      if (!data?.redirectUrl) {
        Alert.alert("Error", "No redirect URL returned from server");
        return;
      }

      const url = data.redirectUrl;
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert("Error", "Cannot open ZipPay checkout URL");
        return;
      }

      await Linking.openURL(url);
    } catch (error: any) {
      console.log("❌ ZipPay ERROR:", error?.response?.data || error?.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create ZipPay order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("🔁 ZipPay Deep link:", url);

      if (url.includes("payment-success")) onSuccess();

      if (url.includes("payment-cancel")) {
        Alert.alert("Payment Cancelled");
        onCancel?.();
      }
    });

    createOrder();
    return () => sub.remove();
  }, []);

  if (loading) return <ActivityIndicator size="large" />;
  return null;
}
