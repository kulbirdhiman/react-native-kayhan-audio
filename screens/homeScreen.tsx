import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ComboDeals from "components/home/comboDeal";
import HotDeals from "components/home/DealSection";
import SupportSection from "components/home/SupportSection";
// import FindSteeringWheel from "components/home/StreeringWheel";

/* ---------------- TYPES ---------------- */
type Step = "company" | "model" | "subModel" | "year";

/* ---------------- SCREEN ---------------- */
export default function HomeScreen() {
  const [company, setCompany] = React.useState<string | null>(null);
  const [model, setModel] = React.useState<string | null>(null);
  const [subModel, setSubModel] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<Step>("company");

  const resetBelow = () => {
    setModel(null);
    setSubModel(null);
    setYear(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>Kayhan Audio</Text>
          <Ionicons name="search" size={22} />
        </View>

        {/* HERO BANNER */}
        <Image
          source={require("../assets/offers/MK 1 and MK 2 (1).png")}
          style={styles.banner}
        />

        {/* VEHICLE SELECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Vehicle</Text>

          {(company || model || subModel || year) && (
            <Text style={styles.selectedText}>
              {company} {model} {subModel} {year}
            </Text>
          )}

          {/* COMPANY */}
          {step === "company" && (
            <View style={styles.row}>
              {Object.keys(VEHICLE_DATA).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.vehicleCard}
                  onPress={() => {
                    setCompany(item);
                    resetBelow();
                    setStep("model");
                  }}
                >
                  <Text style={styles.vehicleText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* MODEL */}
          {step === "model" && company && (
            <View style={styles.row}>
              {Object.keys(VEHICLE_DATA[company]).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.vehicleCard}
                  onPress={() => {
                    setModel(item);
                    setStep("subModel");
                  }}
                >
                  <Text style={styles.vehicleText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* SUB MODEL */}
          {step === "subModel" && company && model && (
            <View style={styles.row}>
              {Object.keys(VEHICLE_DATA[company][model]).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.vehicleCard}
                  onPress={() => {
                    setSubModel(item);
                    setStep("year");
                  }}
                >
                  <Text style={styles.vehicleText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* YEAR */}
          {step === "year" && company && model && subModel && (
            <View style={styles.row}>
              {VEHICLE_DATA[company][model][subModel].map((item: string) => (
                <TouchableOpacity
                  key={item}
                  style={styles.vehicleCard}
                  onPress={() => setYear(item)}
                >
                  <Text style={styles.vehicleText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* CATEGORIES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.grid}>
            {CATEGORY_DATA.map((item, index) => (
              <View key={index} style={styles.categoryCard}>
                <Image source={{ uri: item.image }} style={styles.catImage} />
                <Text style={styles.catText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FEATURED PRODUCTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          {PRODUCTS.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
                <TouchableOpacity style={styles.shopBtn}>
                  <Text style={styles.shopText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <ComboDeals />
        <HotDeals />
        {/* ACCESSORIES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessories</Text>
          <View style={styles.grid}>
            {ACCESSORIES.map((item, index) => (
              <View key={index} style={styles.accessoryCard}>
                <Image source={{ uri: item.image }} style={styles.accImage} />
                <Text style={styles.accText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <SupportSection />
        {/* <FindSteeringWheel /> */}
        {/* NEWSLETTER */}
        <View style={styles.newsletter}>
          <Text style={styles.newsTitle}>Never miss anything!</Text>
          <Text style={styles.newsText}>
            Subscribe to get updates & offers
          </Text>
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- DATA ---------------- */

const VEHICLE_DATA: any = {
  Ford: {
    Falcon: {
      XR6: ["2016", "2017", "2018"],
      XR8: ["2017", "2018"],
    },
    Territory: {
      TX: ["2015", "2016"],
      TS: ["2016", "2017"],
    },
  },
  Toyota: {
    Corolla: {
      Sport: ["2018", "2019"],
      Hybrid: ["2019", "2020"],
    },
    Hilux: {
      SR: ["2017", "2018"],
      SR5: ["2019", "2020"],
    },
  },
  BMW: {
    X5: {
      Base: ["2019", "2020"],
    },
    X3: {
      M: ["2020", "2021"],
    },
  },
};

const CATEGORY_DATA = [
  {
    title: "Head Units",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1765889506754_MK1.png&w=2048&q=75",
  },
  {
    title: "Digital Cluster",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1768000097327_2.png&w=2048&q=75",
  },
  {
    title: "CarPlay",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1741691715893_1-197.jpg&w=2048&q=75",
  },
  {
    title: "Steering Wheel",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1741496263373_1.jpg&w=2048&q=75",
  },
];

const PRODUCTS = [
  {
    name: "Android Head Unit",
    price: "899",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1765889506754_MK1.png&w=2048&q=75",
  },
  {
    name: "Digital Instrument Cluster",
    price: "1299",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1768000097327_2.png&w=2048&q=75",
  },
];

const ACCESSORIES = [
  {
    name: "Reverse Camera",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1740993396573_360cam.jpg&w=2048&q=75",
  },
  {
    name: "Steering Wheel Control",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1741496263373_1.jpg&w=2048&q=75",
  },
  {
    name: "Headrest",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1741065794771_Z.jpg&w=2048&q=75",
  },
  {
    name: "USB Hub",
    image:
      "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1741521115579_1-14.jpg&w=2048&q=75",
  },
];

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
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
