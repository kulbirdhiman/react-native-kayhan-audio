import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import AddressStep from "../components/checkout/AddressStep";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";

export default function CheckoutScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();

  // Cart
  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, i) => sum + i.price * i.qty,
        0
      ),
    [cartItems]
  );

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

  const total = subtotal + shippingPrice;

  // ✅ Proper structured shipping address
  const shippingAddress = {
    name: firstName,
    last_name: lastName,
    email,
    phone,
    street_address: street,
    city: selectedCity,
    postcode,

    country: selectedCountry
      ? {
        id: selectedCountry.numericCode,
        name: selectedCountry.name,
        iso2: selectedCountry.isoCode,
        iso3: selectedCountry.isoCode,
      }
      : null,

    country_name: selectedCountry?.name || null,

    state: selectedState
      ? {
        id: selectedState.isoCode,
        name: selectedState.name,
        state_code: selectedState.isoCode,
      }
      : null,

    state_name: selectedState?.name || null,
  };

  const handleContinue = () => {
    if (step === 1) {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !street ||
        !selectedCountry ||
        !selectedState ||
        !selectedCity ||
        !postcode
      ) {
        Alert.alert(
          "Incomplete Address",
          "Please fill all address fields"
        );
        return;
      }
    }

    if (step === 2 && selectedShipping === null) {
      Alert.alert(
        "Select Shipping",
        "Please choose a shipping method"
      );
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      Alert.alert("Success 🎉", "Order Placed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {["Address", "Shipping", "Payment"].map((label, i) => (
          <View
            key={i}
            style={[
              styles.stepPill,
              step === i + 1 && styles.activeStep,
            ]}
          >
            <Text
              style={[
                styles.stepText,
                step === i + 1 && styles.activeStepText,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 220,
        }}
      >
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>
                  {item.name}
                </Text>
                <Text style={styles.qty}>Qty {item.qty}</Text>
              </View>
              <Text style={styles.price}>
                ₹{item.price * item.qty}
              </Text>
            </View>
          ))}
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
            productData={cartItems}
            shippingAddress={shippingAddress}
          />
        )}

        {step === 3 && (
          <PaymentStep
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            shippingAddress={shippingAddress}
            billingAddress={shippingAddress} // or create separate billing state if needed
            productData={cartItems}
            selectedShipping={selectedShipping ?? 0}
            discount={0} // change if you implement coupon logic
          />
        )}

      </ScrollView>

      {/* Bottom Summary */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + 10 },
        ]}
      >
        <View style={styles.summaryBox}>
          <View style={styles.priceRow}>
            <Text>Subtotal</Text>
            <Text>₹{subtotal}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text>Shipping</Text>
            <Text>₹{shippingPrice}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>
              ₹{total}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cta} onPress={handleContinue}>
          <Text style={styles.ctaText}>
            {step < 3 ? "Continue" : "Pay Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  header: { flexDirection: "row", alignItems: "center", padding: 18, backgroundColor: "#FFF" },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 12 },
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
  ctaText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});
