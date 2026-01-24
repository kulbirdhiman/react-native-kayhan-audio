import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SupportSection() {
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
          <TextInput placeholder="Name" style={styles.input} />
          <TextInput placeholder="Car Make" style={styles.input} />
        </View>

        <View style={styles.row}>
          <TextInput placeholder="Car Model" style={styles.input} />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <TextInput
          placeholder="Phone"
          keyboardType="phone-pad"
          style={styles.inputFull}
        />

        <TextInput
          placeholder="Message"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
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
  container: {
    padding: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  form: {
    width: "100%",
    maxWidth: 500,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  input: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },

  inputFull: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180,
    marginTop: 20,
  },
});
