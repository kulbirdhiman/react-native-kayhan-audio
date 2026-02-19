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
  onSuccess: (orderId: number) => void;
  onCancel?: () => void;
}

const API_BASE = "http://192.168.1.39:5002";

export default function PayPalWebView({
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

  const [paypalOrderID, setPaypalOrderID] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const createPayPalOrder = async () => {
    // ✅ normalize products (same style as Afterpay)
    const normalizedProducts = (productData || []).map((item) => {
      const quantity = item?.quantity ?? item?.qty ?? 1;

      return {
        ...item,
        quantity,
        variations: Array.isArray(item?.variations) ? item.variations : [],
        regular_price: item?.regular_price ?? item?.price ?? 0,
        discount_price:
          item?.discount_price !== undefined ? item.discount_price : 0,
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

    // ✅ safe user: real object or null (not {})
    const safeUser = user && Object.keys(user).length > 0 ? user : null;

    // ✅ safe discount: if you require coupon_code, enforce it
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

      // ✅ IMPORTANT: keep same behavior as Afterpay
      discount: safeDiscount,

      // ✅ match your backend key naming
      payment_method: 4, // PayPal
      deviceDetails:
        deviceDetails && Object.keys(deviceDetails).length > 0
          ? deviceDetails
          : { ip: "0.0.0.0", type: Platform.OS },
    };

    console.log("📦 PayPal Payload:", payload);

    const { data } = await axios.post(
      `${API_BASE}/v1/paypal/create-order`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!data?.approvalUrl) {
      throw new Error("No approvalUrl returned from server");
    }

    // store for capture step
    setPaypalOrderID(data.orderID);
    setOrderData(data.order);

    return data.approvalUrl as string;
  };

  const capturePayPalOrder = async (orderID: string, order: any) => {
    const { data } = await axios.post(
      `${API_BASE}/v1/paypal/capture-order`,
      { orderID, order },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  };

  const failedPayPalOrder = async (order: any) => {
    try {
      await axios.post(
        `${API_BASE}/v1/paypal/failed-order`,
        { order },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.log("failed-order log error", e);
    }
  };

  const startPayPal = async () => {
    try {
      setLoading(true);

      const approvalUrl = await createPayPalOrder();

      const canOpen = await Linking.canOpenURL(approvalUrl);
      if (!canOpen) {
        Alert.alert("Error", "Cannot open PayPal approval URL");
        return;
      }

      await Linking.openURL(approvalUrl);
    } catch (error: any) {
      console.log("❌ PayPal ERROR:", error?.response?.data || error?.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create PayPal order"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    const sub = Linking.addEventListener("url", async ({ url }) => {
      console.log("🔁 PayPal Deep link:", url);

      // ✅ success
      if (url.includes("paypal-success")) {
        if (!paypalOrderID || !orderData) {
          Alert.alert("Error", "Missing PayPal order data");
          setLoading(false);
          return;
        }

        try {
          const captureRes = await capturePayPalOrder(paypalOrderID, orderData);

          if (captureRes?.status === "COMPLETED") {
            setLoading(false);
            onSuccess(orderData.id);
          } else {
            console.log("PayPal not completed:", captureRes);
            await failedPayPalOrder(orderData);
            setLoading(false);
            Alert.alert("Payment not completed");
          }
        } catch (e: any) {
          console.log("❌ PayPal capture error:", e?.response?.data || e?.message);
          await failedPayPalOrder(orderData);
          setLoading(false);
          Alert.alert("Error", "PayPal capture failed");
        }
      }

      // ✅ cancel
      if (url.includes("paypal-cancel")) {
        if (orderData) await failedPayPalOrder(orderData);
        setLoading(false);
        onCancel?.();
      }
    });

    // ✅ auto-start like Afterpay
    startPayPal();

    return () => sub.remove();
    // NOTE: keep deps empty to behave like Afterpay (start once)
  }, []);

  if (loading) return <ActivityIndicator size="large" />;
  return null;
}
