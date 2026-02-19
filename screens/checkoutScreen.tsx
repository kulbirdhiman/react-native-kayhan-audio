// ✅ CheckoutScreen.tsx (UPDATED - cart shape uses product_id + quantity + coupon_code as discount)

import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import AddressStep from "../components/checkout/AddressStep";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";

export default function CheckoutScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();

  const [startPayment, setStartPayment] = useState(false);

  // ✅ Cart from redux (backend-ready shape)
  const cartItemsRedux = useSelector((state: RootState) => state.cart.items);

  // ✅ Local cart so we can append coupon free-product without touching redux
  const [cartLocalItems, setCartLocalItems] = useState<any[]>(cartItemsRedux);

  React.useEffect(() => {
    setCartLocalItems(cartItemsRedux);
  }, [cartItemsRedux]);

  // ✅ Coupon / discount state
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountData, setDiscountData] = useState<any>(null);

  const subtotal = useMemo(() => {
    return (cartLocalItems || []).reduce((sum, i) => {
      const q = Number(i.quantity ?? i.qty ?? 1) || 1;
      const price = Number(i.price) || 0;
      return sum + price * q;
    }, 0);
  }, [cartLocalItems]);

  // Address state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [postcode, setPostcode] = useState("");

  // Shipping & Payment
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);

  // ✅ apply free shipping if coupon says so
  const finalShipping = useMemo(() => {
    if (discountData?.is_shipping_free == 1) return 0;
    return shippingPrice;
  }, [discountData, shippingPrice]);

  // ✅ IMPORTANT: your API returns DISCOUNT amount in `coupon_code` (example: 18)
  const couponDiscountValue = useMemo(() => {
    const d =
      discountData?.discount_amount ?? // if PaymentStep normalized it
      discountData?.coupon_code ??      // your backend result shows this is discount
      0;

    const n = Number(d) || 0;
    return n < 0 ? 0 : n;
  }, [discountData]);

  const total = useMemo(() => {
    const t = subtotal + finalShipping - couponDiscountValue;
    return t < 0 ? 0 : t;
  }, [subtotal, finalShipping, couponDiscountValue]);

  // ✅ normalize country/state IDs so backend never gets undefined
  const shippingAddress = useMemo(
    () => ({
      name: firstName,
      last_name: lastName,
      email,
      phone,
      street_address: street,
      city: selectedCity,
      postcode,

      country: selectedCountry
        ? {
            id:
              selectedCountry.id ??
              selectedCountry.numericCode ??
              selectedCountry.country_id ??
              null,
            name: selectedCountry.name ?? "",
            iso2: selectedCountry.isoCode ?? selectedCountry.iso2 ?? "",
            iso3: selectedCountry.iso3 ?? selectedCountry.isoCode ?? "",
          }
        : null,
      country_name: selectedCountry?.name || null,

      state: selectedState
        ? {
            id:
              selectedState.id ??
              selectedState.state_id ??
              selectedState.isoCode ??
              null,
            name: selectedState.name ?? "",
            state_code: selectedState.state_code ?? selectedState.isoCode ?? "",
          }
        : null,
      state_name: selectedState?.name || null,
    }),
    [
      firstName,
      lastName,
      email,
      phone,
      street,
      selectedCity,
      postcode,
      selectedCountry,
      selectedState,
    ]
  );

  const isAddressValid = useMemo(() => {
    return (
      !!firstName &&
      !!lastName &&
      !!email &&
      !!phone &&
      !!street &&
      !!selectedCountry &&
      !!selectedState &&
      !!selectedCity &&
      !!postcode
    );
  }, [
    firstName,
    lastName,
    email,
    phone,
    street,
    selectedCountry,
    selectedState,
    selectedCity,
    postcode,
  ]);

  const goBackStep = useCallback(() => {
    if (step === 3 && startPayment) {
      setStartPayment(false);
      return true;
    }

    if (step > 1) {
      setStep((s) => s - 1);
      return true;
    }

    navigation.goBack();
    return true;
  }, [step, startPayment, navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => goBackStep();
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [goBackStep])
  );

  const onSelectPayment = (id: number) => {
    setSelectedPayment(id);
    setStartPayment(false);
  };

  const handleContinue = () => {
    if (step === 1 && !isAddressValid) {
      Alert.alert("Incomplete Address", "Please fill all address fields");
      return;
    }

    if (step === 2 && selectedShipping === null) {
      Alert.alert("Select Shipping", "Please choose a shipping method");
      return;
    }

    if (step === 3) {
      if (selectedPayment === 0) {
        Alert.alert("Select Payment", "Please choose a payment method");
        return;
      }
      setStartPayment(true);
      return;
    }

    setStep(step + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackStep}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSub}>Step {step} of 3</Text>
        </View>
      </View>

      <View style={styles.steps}>
        {["Address", "Shipping", "Payment"].map((label, i) => (
          <View key={i} style={[styles.stepPill, step === i + 1 && styles.activeStep]}>
            <Text style={[styles.stepText, step === i + 1 && styles.activeStepText]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 220 }}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {cartLocalItems.map((item: any, idx: number) => {
            const key = item.product_id ?? item.id ?? item.cart_id ?? idx;
            const qty = Number(item.quantity ?? item.qty ?? 1) || 1;

            const img =
              item.image ??
              item.images?.[0]?.image ??
              item.images?.[0]?.url ??
              item.images?.[0] ??
              undefined;

            return (
              <View key={key} style={styles.productRow}>
                <Image
                  source={{ uri: img || "https://via.placeholder.com/60" }}
                  style={styles.image}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.qty}>Qty {qty}</Text>
                  {item.is_free == 1 && (
                    <Text style={{ fontSize: 12, color: "#16a34a" }}>Free item</Text>
                  )}
                </View>
                <Text style={styles.price}>₹{(Number(item.price) || 0) * qty}</Text>
              </View>
            );
          })}
        </View>

        {step === 1 && (
          <AddressStep
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            street={street}
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedCity={selectedCity}
            postcode={postcode}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            setPhone={setPhone}
            setStreet={setStreet}
            setSelectedCountry={setSelectedCountry}
            setSelectedState={setSelectedState}
            setSelectedCity={setSelectedCity}
            setPostcode={setPostcode}
          />
        )}

        {step === 2 && (
          <ShippingStep
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            setShippingPrice={setShippingPrice}
            productData={cartLocalItems}
            shippingAddress={shippingAddress}
          />
        )}

        {step === 3 && (
          <PaymentStep
            selectedPayment={selectedPayment}
            setSelectedPayment={onSelectPayment}
            startPayment={startPayment}
            onPaid={() => {
              Alert.alert("Success 🎉", "Payment Successful");
              setStartPayment(false);
              setSelectedPayment(0);
            }}
            onCancel={() => {
              Alert.alert("Cancelled", "Payment Cancelled");
              setStartPayment(false);
            }}
            shippingAddress={shippingAddress}
            billingAddress={shippingAddress}
            productData={cartLocalItems}
            selectedShipping={selectedShipping ?? 0}
            discount={discountData}
            user={{}}
            deviceDetails={{}}
            setDiscountData={setDiscountData}
            setCouponApplied={setCouponApplied}
            setCartItems={setCartLocalItems}
          />
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.summaryBox}>
          <View style={styles.priceRow}>
            <Text>Subtotal</Text>
            <Text>₹{subtotal}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text>Shipping</Text>
            <Text>₹{finalShipping}</Text>
          </View>

          {couponApplied && couponDiscountValue > 0 && (
            <View style={styles.priceRow}>
              <Text>Coupon</Text>
              <Text>-₹{couponDiscountValue}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{total}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.cta, step === 3 && startPayment && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={step === 3 && startPayment}
        >
          <Text style={styles.ctaText}>
            {step < 3 ? "Continue" : startPayment ? "Processing..." : "Pay Now"}
          </Text>
        </TouchableOpacity>

        {step === 3 && startPayment && (
          <Text style={styles.helperText}>
            Payment window opened. Use back to change method.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  header: { flexDirection: "row", alignItems: "center", padding: 18, backgroundColor: "#FFF" },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 12 },
  headerSub: { marginLeft: 12, marginTop: 2, fontSize: 12, color: "#777" },

  steps: { flexDirection: "row", justifyContent: "center", marginVertical: 12 },
  stepPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, backgroundColor: "#E5E7EB", marginHorizontal: 6 },
  activeStep: { backgroundColor: "#000" },
  activeStepText: { color: "#FFF" },
  stepText: { fontSize: 13, fontWeight: "600" },

  card: { backgroundColor: "#FFF", margin: 12, padding: 18, borderRadius: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 14 },

  productRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  image: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
  productName: { fontSize: 14, fontWeight: "600" },
  qty: { fontSize: 12, color: "#777" },
  price: { fontSize: 15, fontWeight: "700" },

  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  totalText: { fontSize: 18, fontWeight: "800" },

  summaryBox: { backgroundColor: "#FFF", padding: 16, borderRadius: 18, marginBottom: 12 },
  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 20 },

  cta: { backgroundColor: "#000", paddingVertical: 18, borderRadius: 20, alignItems: "center" },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  helperText: { textAlign: "center", marginTop: 8, fontSize: 12, color: "#777" },
});
