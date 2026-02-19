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
  onSuccess: (orderId: number) => void;
  onCancel?: () => void;
};

const API_BASE = "https://api.kayhanaudio.com.au";

export default function PayPalButton({
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

  const [paypalOrderID, setPaypalOrderID] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

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

  const createPayPalOrder = async () => {
    const payload = {
      selectedShipping,
      user,
      shippingAddress,
      billingAddress,
      productData: normalizedProducts,
      discount,
      paymentMethod: 1, // ✅ PayPal int (your log shows payment_method: 1)
      deviceDetails: deviceDetails ?? { ip: "0.0.0.0", type: Platform.OS },
    };

    const { data } = await axios.post(
      `${API_BASE}/v1/paypal/create-order`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(data , "this is data")
    // backend should send approvalUrl
    if (!data?.approvalUrl) {
      throw new Error("No approvalUrl returned from server");
    }

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
    return data; // expect { status: "COMPLETED" ... }
  };
  
  const failedPayPalOrder = async (order: any) => {
    try {
      await axios.post(
        `${API_BASE}/v1/paypal/failed-order`,
        { order },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (e) {
      // don't block UI
      console.log("failed-order log error", e);
    }
  };

  const handlePayPal = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const approvalUrl = await createPayPalOrder();
      await Linking.openURL(approvalUrl);
    } catch (err: any) {
      console.log("❌ PayPal create error:", err?.message || err);
      Alert.alert("Error", err?.message || "Failed to create PayPal order");
      setIsProcessing(false);
    }
  };

  // ✅ listen deep link and capture
  useEffect(() => {
    const sub = Linking.addEventListener("url", async ({ url }) => {
      console.log("🔁 PayPal deep link:", url);

      // success
      if (url.includes("paypal-success")) {
        if (!paypalOrderID || !orderData) {
          Alert.alert("Error", "Missing PayPal order data");
          setIsProcessing(false);
          return;
        }

        try {
          const captureRes = await capturePayPalOrder(paypalOrderID, orderData);

          if (captureRes?.status === "COMPLETED") {
            setIsProcessing(false);
            onSuccess(orderData.id);
          } else {
            console.log("PayPal not completed:", captureRes);
            await failedPayPalOrder(orderData);
            setIsProcessing(false);
            Alert.alert("Payment not completed");
          }
        } catch (e: any) {
          console.log("❌ capture error:", e?.response?.data || e?.message);
          await failedPayPalOrder(orderData);
          setIsProcessing(false);
          Alert.alert("Error", "PayPal capture failed");
        }
      }

      // cancel
      if (url.includes("paypal-cancel")) {
        if (orderData) await failedPayPalOrder(orderData);
        setIsProcessing(false);
        onCancel?.();
      }
    });

    return () => sub.remove();
  }, [paypalOrderID, orderData, onSuccess, onCancel]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePayPal}
        disabled={isProcessing}
        style={({ pressed }) => [
          styles.button,
          isProcessing && styles.disabled,
          pressed && !isProcessing && styles.pressed,
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>Pay with PayPal</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, width: "100%" },
  button: {
    width: "100%",
    backgroundColor: "#003087",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
});
