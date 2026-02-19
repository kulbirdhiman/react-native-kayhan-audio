import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AfterpayWebView from "./payment/AfterpayWebView";
import ZipPayButton from "./payment/ZipPayButton";
import PayPalWebView from "./payment/PayPalWebView";

import { useApplyCouponMutation } from "store/api/checkout/checkoutAPi";

// ✅ MATCH YOUR BACKEND (based on your result: coupon_type = 2 means discount)
const COUPEN_TYPE = {
  free_shipping: 1,
  discount: 2,
  product: 3,
} as const;

interface Props {
  selectedPayment: number;
  setSelectedPayment: (i: number) => void;

  startPayment: boolean;
  onPaid: () => void;
  onCancel: () => void;

  shippingAddress: any;
  billingAddress: any;
  productData: any[];
  selectedShipping: number;
  discount: any;
  user: any;
  deviceDetails: any;

  sameAsBilling?: boolean;
  selectedAddress?: any;

  setDiscountData: (d: any) => void;
  setCouponApplied: (v: boolean) => void;
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
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

  sameAsBilling = true,
  selectedAddress,

  setDiscountData,
  setCouponApplied,
  setCartItems,
}: Props) {
  const methods = useMemo(
    () => [
      { id: 1, name: "PayPal" },
      { id: 2, name: "Afterpay" },
      { id: 3, name: "Zip Pay" },
    ],
    []
  );

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const [applyCoupon, { isLoading: couponLoading }] = useApplyCouponMutation();

  const normalizeShipAddress = (addr: any) => {
    if (!addr) return addr;

    const country = addr.country
      ? {
          id: addr.country?.id ?? addr.country_id ?? addr.countryId ?? null,
          name: addr.country?.name ?? addr.country_name ?? "",
          iso3: addr.country?.iso3 ?? addr.country_iso3 ?? "",
          iso2: addr.country?.iso2 ?? addr.country_iso2 ?? "",
        }
      : null;

    const state = addr.state
      ? {
          id: addr.state?.id ?? addr.state_id ?? addr.stateId ?? null,
          name: addr.state?.name ?? addr.state_name ?? "",
          state_code: addr.state?.state_code ?? addr.state_code ?? "",
        }
      : null;

    return {
      ...addr,
      country: country || addr.country,
      country_name: addr.country_name ?? country?.name ?? "",
      state: state || addr.state,
      state_name: addr.state_name ?? state?.name ?? "",
    };
  };

  const normalizeProductsForCoupon = (items: any[]) => {
    return (items || []).map((p) => {
      const quantity = Number(p.quantity ?? 1) || 1;

      const images = Array.isArray(p.images)
        ? p.images
        : p.image
        ? [p.image]
        : [];

      const regular_price = Number(p.regular_price ?? 0) || 0;
      const discount_price = Number(p.discount_price ?? 0) || 0;

      const price =
        Number(p.price ?? (discount_price > 0 ? discount_price : regular_price)) || 0;

      return {
        cart_id: p.cart_id ?? Date.now(),
        images,
        quantity,
        name: p.name ?? "",
        slug: p.slug ?? "",
        weight: Number(p.weight ?? 0) || 0,
        variations: Array.isArray(p.variations) ? p.variations : [],
        product_id: Number(p.product_id ?? p.id ?? 0) || 0,
        regular_price,
        discount_price,
        price,
        department_id: Number(p.department_id ?? 0) || 0,
        category_id: Number(p.category_id ?? 0) || 0,
        model_id: Number(p.model_id ?? 0) || 0,
      };
    });
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      Alert.alert("Coupon", "Please enter a coupon code.");
      return;
    }

    const rawShipAddress = sameAsBilling
      ? user
        ? selectedAddress || billingAddress
        : billingAddress
      : shippingAddress;

    const ship_address = normalizeShipAddress(rawShipAddress);
    const products = normalizeProductsForCoupon(productData || []);

    try {
      const apiRes = await applyCoupon({ products, code, ship_address }).unwrap();

      if (!apiRes?.success) {
        Alert.alert("Coupon", apiRes?.message || "Invalid coupon code.");
        return;
      }

      const result = apiRes?.data?.result;

      // ✅ Your API uses coupon_code as DISCOUNT AMOUNT
      const discount_amount = Number(result?.coupon_code ?? 0) || 0;

      // ✅ store a normalized discount object for Checkout
      const normalizedDiscount = {
        ...result,
        discount_amount,
      };

      setDiscountData(normalizedDiscount);
      setCouponApplied(true);

      // ✅ Only if coupon type is PRODUCT
      if (result?.coupon_type == COUPEN_TYPE.product && result?.product) {
        const r = result.product;

        const regular_price = Number(r.regular_price || 0);
        const discount_price = Number(r.discount_price || 0);
        const price = discount_price > 0 ? discount_price : regular_price;

        const freeProduct = {
          cart_id: Date.now(),
          product_id: r.id,
          name: r.name,
          slug: r.slug,
          weight: Number(r.weight || 0),
          variations: [],
          images: Array.isArray(r.images) ? r.images : r.image ? [r.image] : [],
          quantity: 1,

          regular_price,
          discount_price,
          price,

          department_id: Number(r.department_id || 0),
          category_id: Number(r.category_id || 0),
          model_id: Number(r.model_id || 0),

          is_free: 1,
        };

        setCartItems((prev) => [...prev, freeProduct]);
      }

      // ✅ free shipping type (if your backend uses coupon_type = 1)
      // Checkout already uses result.is_shipping_free, so nothing else needed.

      Alert.alert("Coupon", apiRes?.message || "Coupon applied successfully!");
      setShowCoupon(false);
    } catch (e: any) {
      Alert.alert("Coupon", e?.data?.message || "Failed to apply coupon.");
    }
  };

  // ✅ Payment render
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
            name={selectedPayment === m.id ? "radio-button-on" : "radio-button-off"}
            size={20}
          />
          <Text style={styles.optionText}>{m.name}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.couponToggle}
        onPress={() => setShowCoupon((p) => !p)}
      >
        <Ionicons name={showCoupon ? "chevron-up" : "chevron-down"} size={18} />
        <Text style={styles.couponToggleText}>Have a coupon code?</Text>
      </TouchableOpacity>

      {showCoupon && (
        <View style={styles.couponBox}>
          <TextInput
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="Enter coupon code"
            autoCapitalize="characters"
            style={styles.couponInput}
          />

          <TouchableOpacity
            style={[styles.couponBtn, couponLoading && { opacity: 0.7 }]}
            onPress={handleApplyCoupon}
            disabled={couponLoading}
          >
            {couponLoading ? <ActivityIndicator /> : <Text style={styles.couponBtnText}>Apply</Text>}
          </TouchableOpacity>
        </View>
      )}

      {selectedPayment === 0 ? (
        <Text style={styles.note}>Select a payment method, then press Pay Now.</Text>
      ) : (
        <Text style={styles.note}>
          Selected: {methods.find((x) => x.id === selectedPayment)?.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", margin: 12, padding: 18, borderRadius: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 14 },
  option: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  optionText: { marginLeft: 12, fontSize: 15 },
  note: { marginTop: 10, fontSize: 12, color: "#777" },
  divider: { height: 1, backgroundColor: "#EEE", marginTop: 10, marginBottom: 10 },
  couponToggle: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  couponToggleText: { marginLeft: 8, fontSize: 13, color: "#444", fontWeight: "600" },
  couponBox: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 8 },
  couponInput: { flex: 1, borderWidth: 1, borderColor: "#DDD", borderRadius: 12, paddingHorizontal: 12, height: 44 },
  couponBtn: { height: 44, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#111", alignItems: "center", justifyContent: "center" },
  couponBtnText: { color: "#FFF", fontWeight: "700" },
});
