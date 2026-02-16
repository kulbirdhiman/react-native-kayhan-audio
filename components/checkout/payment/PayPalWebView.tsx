import React, { useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";

interface Props {
  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: number;
  onSuccess: () => void;
}

export default function PayPalWebView({
  shippingAddress,
  billingAddress,
  productData,
  selectedShipping,
  discount,
  onSuccess,
}: Props) {
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);

  // Step 1: Create Order
  const createOrder = async () => {
    try {
      const { data } = await axios.post(
        "https://api.kayhanaudio.com.au/v1/paypal/create-order",
        {
          selectedShipping,
          shippingAddress,
          billingAddress,
          productData,
          discount,
        }
      );

      setApprovalUrl(data.approvalUrl);
    } catch (err) {
      Alert.alert("Error", "Failed to create PayPal order");
    }
  };

  React.useEffect(() => {
    createOrder();
  }, []);

  // Step 2: Detect Redirect
  const handleNavigation = async (event: any) => {
    if (event.url.includes("payment-success")) {
      try {
        await axios.post(
          "https://api.kayhanaudio.com.au/v1/paypal/capture-order",
          {}
        );

        onSuccess();
      } catch (err) {
        Alert.alert("Payment Failed");
      }
    }

    if (event.url.includes("payment-cancel")) {
      Alert.alert("Payment Cancelled");
    }
  };

  if (!approvalUrl) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <WebView
      source={{ uri: approvalUrl }}
      onNavigationStateChange={handleNavigation}
    />
  );
}
