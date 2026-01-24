import { Image, StyleSheet } from "react-native";

export default function HeroBanner() {
  return (
    <Image
      source={require("../../assets/offers/MK 1 and MK 2 (1).png")}
      style={styles.banner}
    />
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
});
