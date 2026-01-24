import {
  StyleSheet,
} from "react-native";
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  logo: { fontSize: 18, fontWeight: "700" },

  banner: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  section: { padding: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  selectedText: {
    marginBottom: 10,
    color: "#555",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  vehicleCard: {
    width: "48%",
    padding: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  vehicleText: { fontWeight: "600" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  categoryCard: {
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },

  catImage: { width: 120, height: 120, resizeMode: "contain" },
  catText: { marginTop: 6, fontWeight: "600" },

  productCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
  },

  productImage: { width: 120, height: 120 },
  productInfo: { flex: 1, padding: 10 },

  productName: { fontWeight: "700" },
  productPrice: { marginVertical: 6 },

  shopBtn: {
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 6,
    width: 100,
  },

  shopText: { color: "#FFF", textAlign: "center" },

  accessoryCard: {
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },

  accImage: { width: 100, height: 100 },
  accText: { marginTop: 6 },

  newsletter: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    alignItems: "center",
  },

  newsTitle: { fontSize: 16, fontWeight: "700" },
  newsText: { marginVertical: 6 },

  subscribeBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },

  subscribeText: { color: "#FFF", fontWeight: "700" },
});