import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Country, State, City } from "country-state-city"; // ✅ Use country-state-city
import { Picker } from "@react-native-picker/picker";

export default function CheckoutScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets(); 

  // ✅ Cart from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // ✅ Address form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [postcode, setPostcode] = useState("");

  // Data
  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

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
            style={[styles.stepPill, step === i + 1 && styles.activeStep]}
          >
            <Text
              style={[styles.stepText, step === i + 1 && styles.activeStepText]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.qty}>Qty {item.qty}</Text>
              </View>
              <Text style={styles.price}>₹{item.price * item.qty}</Text>
            </View>
          ))}
        </View>

        {/* Address Step */}
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>

            <View style={styles.row}>
              <TextInput
                placeholder="First Name"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                placeholder="Last Name"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Phone"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              placeholder="Street Address"
              style={styles.input}
              value={street}
              onChangeText={setStreet}
            />

            {/* Country Picker */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  setSelectedState("");
                  setSelectedCity("");
                }}
              >
                <Picker.Item label="Select Country" value="" />
                {countries.map((c) => (
                  <Picker.Item key={c.isoCode} label={c.name} value={c.isoCode} />
                ))}
              </Picker>
            </View>

            {/* State Picker */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedState}
                enabled={!!selectedCountry}
                onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedCity("");
                }}
              >
                <Picker.Item label="Select State" value="" />
                {states.map((s) => (
                  <Picker.Item key={s.isoCode} label={s.name} value={s.isoCode} />
                ))}
              </Picker>
            </View>

            {/* City Picker */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCity}
                enabled={!!selectedState}
                onValueChange={(value) => setSelectedCity(value)}
              >
                <Picker.Item label="Select City" value="" />
                {cities.map((c) => (
                  <Picker.Item key={c.name} label={c.name} value={c.name} />
                ))}
              </Picker>
            </View>

            <TextInput
              placeholder="Postcode"
              style={styles.input}
              value={postcode}
              onChangeText={setPostcode}
            />
          </View>
        )}

        {/* Shipping Step */}
        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Shipping Method</Text>
            {["Standard Delivery (Free)", "Express Delivery ₹10"].map((m, i) => (
              <TouchableOpacity key={i} style={styles.option}>
                <Ionicons
                  name={i === 0 ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color="#000"
                />
                <Text style={styles.optionText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Payment Step */}
        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {["Cash on Delivery", "UPI", "Card"].map((p, i) => (
              <TouchableOpacity key={i} style={styles.option}>
                <Ionicons
                  name={i === 0 ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color="#000"
                />
                <Text style={styles.optionText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text>Subtotal</Text>
            <Text>₹{subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{subtotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.cta}
          onPress={() =>
            step < 3 ? setStep(step + 1) : alert("Order Placed 🎉")
          }
        >
          <Text style={styles.ctaText}>{step < 3 ? "Continue" : "Pay Now"}</Text>
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

  row: { flexDirection: "row" },
  input: { backgroundColor: "#F3F4F6", borderRadius: 14, padding: 14, marginBottom: 12, flex: 1, marginRight: 6 },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    marginBottom: 12,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },

  option: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  optionText: { marginLeft: 12, fontSize: 15 },

  priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  totalText: { fontSize: 18, fontWeight: "800" },

  bottomBar: { position: "absolute", left: 16, right: 16, bottom: 20 },
  cta: { backgroundColor: "#000", paddingVertical: 18, borderRadius: 20, alignItems: "center" },
  ctaText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});
