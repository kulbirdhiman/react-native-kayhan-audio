import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useRef, useEffect, useState } from "react";

const { width } = Dimensions.get("window");

const TABS = ["Android stereos", "Linux headunits", "Carplay Modules"];

const OFFERS = [
  { id: 1, image: "https://...1.jpg" },
  { id: 2, image: "https://...2.jpg" },
  { id: 3, image: "https://...3.jpg" },
  { id: 4, image: "https://...4.jpg" },
];

const PRODUCTS = [
  { id: 1, title: "BA / BF / SY", brand: "Ford", price: 50, oldPrice: 185, image: "https://...1.jpg" },
  { id: 2, title: "Universal Headunit", brand: "Generic", price: 120, oldPrice: 199, image: "https://...2.jpg" },
  { id: 3, title: "Carplay Module", brand: "Apple", price: 250, oldPrice: 399, image: "https://...3.jpg" },
];

export default function HomeScreen() {
  const sliderRef = useRef<FlatList>(null);
  const sliderIndex = useRef(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Auto-scroll slider
  useEffect(() => {
    const interval = setInterval(() => {
      sliderIndex.current = (sliderIndex.current + 1) % OFFERS.length;
      sliderRef.current?.scrollToIndex({ index: sliderIndex.current, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Render slider as ListHeaderComponent
  const renderSlider = () => (
    <View style={{ marginVertical: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>Special Offer</Text>
      <FlatList
        ref={sliderRef}
        data={OFFERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={{ width: width - 32, height: 192, marginHorizontal: 8, borderRadius: 16 }}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );

  // Render tabs
  const renderTabs = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 12, backgroundColor: "#fff", borderRadius: 16, paddingVertical: 6, marginHorizontal: 8, elevation: 2 }}>
      {TABS.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: activeTab === tab ? "red" : "#888" }}>{tab}</Text>
          {activeTab === tab && <View style={{ height: 2, width: 20, backgroundColor: "red", borderRadius: 2, marginTop: 2 }} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render products
  const renderProductCard = ({ item, index }) => {
    if (index === 0) {
      // Featured main card
      return (
        <View style={{ backgroundColor: "#fff", borderRadius: 24, marginVertical: 8, overflow: "hidden", elevation: 4, marginHorizontal: 8 }}>
          <Image source={{ uri: item.image }} style={{ width: "100%", height: 220 }} resizeMode="cover" />
          <View style={{ padding: 12 }}>
            <Text style={{ fontSize: 12, color: "#888" }}>{item.brand}</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 4 }}>{item.title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
              <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>${item.price}</Text>
              <Text style={{ color: "#aaa", textDecorationLine: "line-through", marginLeft: 8 }}>${item.oldPrice}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: "red", paddingVertical: 10, borderRadius: 12, marginTop: 8 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      // Two small side cards
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8, marginHorizontal: 8 }}>
          {PRODUCTS.slice(1).map((prod) => (
            <View key={prod.id} style={{ width: (width - 40) / 2, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", elevation: 3 }}>
              <Image source={{ uri: prod.image }} style={{ width: "100%", height: 140 }} resizeMode="cover" />
              <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 10, color: "#888" }}>{prod.brand}</Text>
                <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 2 }}>{prod.title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  <Text style={{ color: "red", fontWeight: "bold", fontSize: 12 }}>${prod.price}</Text>
                  <Text style={{ color: "#aaa", textDecorationLine: "line-through", marginLeft: 4 }}>${prod.oldPrice}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: "red", paddingVertical: 6, borderRadius: 10, marginTop: 6 }}>
                  <Text style={{ color: "#fff", textAlign: "center", fontSize: 12, fontWeight: "bold" }}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      );
    }
  };

  return (
    <FlatList
      data={PRODUCTS}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <>
          {renderSlider()}
          {renderTabs()}
        </>
      }
      renderItem={renderProductCard}
      contentContainerStyle={{ paddingBottom: 24, backgroundColor: "#f5f5f5" }}
      showsVerticalScrollIndicator={false}
    />
  );
}
