import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function MKUpgradeBanner() {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient
      colors={["#0f172a", "#020617"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* TOP TEXT */}
      <Text style={styles.title}>
        Already have <Text style={styles.highlight}>MK-1</Text>?
      </Text>

      {/* CTA BUTTON */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.button}
        onPress={() =>
          navigation.navigate("ProductDetail", { slug: "mk2-upgrade" })
        }
      >
        <Text style={styles.buttonText}>
          Upgrade to <Text style={styles.buttonHighlight}>MK-2</Text>
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: 0.3,
  },

  highlight: {
    color: "#60a5fa",
  },

  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#2563eb",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 7,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  buttonHighlight: {
    color: "#bfdbfe",
    fontWeight: "800",
  },
});
