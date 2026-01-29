import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNewcontactSupportMutation } from "store/api/home/HomeAPi";

export default function SupportSection() {
  const [form, setForm] = useState({
    name: "",
    car_make: "",
    car_model: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sendSupport, { isLoading }] = useNewcontactSupportMutation();

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      await sendSupport(form).unwrap(); // send form data in body
      Alert.alert("Success", "Your message has been sent!");
      setForm({
        name: "",
        car_make: "",
        car_model: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need help finding something?</Text>
      <Text style={styles.subtitle}>
        Our support team is ready to assist you. Fill out the form and we’ll
        respond promptly.
      </Text>

      {/* FORM */}
      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            placeholder="Car Make"
            style={styles.input}
            value={form.car_make}
            onChangeText={(text) => handleChange("car_make", text)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Car Model"
            style={styles.input}
            value={form.car_model}
            onChangeText={(text) => handleChange("car_model", text)}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>

        <TextInput
          placeholder="Phone"
          keyboardType="phone-pad"
          style={styles.inputFull}
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />

        <TextInput
          placeholder="Message"
          multiline
          numberOfLines={4}
          style={styles.textArea}
          value={form.message}
          onChangeText={(text) => handleChange("message", text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Sending..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SOCIAL ICONS */}
      <View style={styles.socialRow}>
        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
        <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
        <Ionicons name="logo-instagram" size={24} color="#E1306C" />
        <Ionicons name="logo-youtube" size={24} color="#FF0000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#FFF", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 20 },
  form: { width: "100%", maxWidth: 500 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  input: { width: "48%", borderWidth: 1, borderColor: "#DDD", borderRadius: 6, padding: 10, marginBottom: 12 },
  inputFull: { width: "100%", borderWidth: 1, borderColor: "#DDD", borderRadius: 6, padding: 10, marginBottom: 12 },
  textArea: { borderWidth: 1, borderColor: "#DDD", borderRadius: 6, padding: 10, height: 100, textAlignVertical: "top", marginBottom: 16 },
  button: { backgroundColor: "#000", paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "700" },
  socialRow: { flexDirection: "row", justifyContent: "space-between", width: 180, marginTop: 20 },
});
