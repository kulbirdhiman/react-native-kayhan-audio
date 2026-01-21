import { View, Text, Image, FlatList, Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get("window");

const offers = [
  { id: 1, image: "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767939747660_30-DSC07429.jpg&w=2048&q=75" },
  { id: 2, image: "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767934473607_5-DSC07531.jpg&w=2048&q=75" },
  { id: 3, image: "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767934473607_5-DSC07531.jpg&w=2048&q=75" },
  { id: 4, image: "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767934473607_5-DSC07531.jpg&w=2048&q=75" },
];

export default function SpecialOfferSlider() {
  const flatListRef = useRef<FlatList>(null);
  const indexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % offers.length;
      setCurrentIndex(indexRef.current);

      flatListRef.current?.scrollToIndex({
        index: indexRef.current,
        animated: true,
      });
    }, 3000); // 3 seconds for smooth auto scroll

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="mt-3">
      <Text className="text-lg font-bold px-3 mb-2">Special Offer</Text>

      <FlatList
        ref={flatListRef}
        data={offers}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width: width - 32, marginHorizontal: 8 }}>
            <Image
              source={{ uri: item.image }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}
