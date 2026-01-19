import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";

const images = [
  "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767939747660_30-DSC07429.jpg&w=2048&q=75",
  "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767934473607_5-DSC07531.jpg&w=2048&q=75",
  "https://kayhanaudio.com.au/_next/image?url=https%3A%2F%2Fd198m4c88a0fux.cloudfront.net%2Fuploads%2F1767934473607_5-DSC07531.jpg&w=2048&q=75",
];

const tabs = ["Description", "Specification", "Demo video", "Review"];

export default function ProductScreen() {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [optionSelected, setOptionSelected] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <Text className="text-gray-700">
            Premium Android head unit with Apple CarPlay, Android Auto and DSP.
          </Text>
        );

      case "Specification":
        return (
          <View>
            <Text className="text-gray-700">
              • Qualcomm QCM6125 Octa-Core
            </Text>
            <Text className="text-gray-700">
              • 6GB RAM / 128GB Storage
            </Text>
            <Text className="text-gray-700">
              • 9 inch IPS Display
            </Text>
          </View>
        );

      case "Demo video":
        return (
          <Text className="text-gray-700">
            Demo video will be shown here.
          </Text>
        );

      case "Review":
        return (
          <Text className="text-gray-700">
            ⭐⭐⭐⭐⭐ Excellent sound quality and fit.
          </Text>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View className="bg-white p-4">
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-[300px] rounded-lg"
          />

          {/* Thumbnails */}
          <View className="flex-row justify-center mt-4 space-x-3">
            {images.map((img, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedImage(img)}>
                <Image
                  source={{ uri: img }}
                  className={`w-20 h-14 rounded-md border ${
                    selectedImage === img
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View className="bg-white mt-2 p-4">
          <Text className="text-lg font-bold text-black">
            Car Stereo with SatNav for HOLDEN Colorado
          </Text>
 
          <Text className="text-gray-500 text-sm mt-1">
            2012 – 2018 | V6 | 9 inch
          </Text>

          <Text className="text-xl font-bold text-black mt-3">
            $1425.00
          </Text>

          {/* Quantity Counter */}
          <View className="flex-row items-center mt-4">
            <TouchableOpacity
              className="border px-4 py-2 rounded"
              onPress={() => setQty(Math.max(1, qty - 1))}
            >
              <Text className="text-lg">-</Text>
            </TouchableOpacity>

            <Text className="mx-4 text-lg">{qty}</Text>

            <TouchableOpacity
              className="border px-4 py-2 rounded"
              onPress={() => setQty(qty + 1)}
            >
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
          </View>

          {/* Option Selector */}
          <TouchableOpacity
            className={`border mt-4 p-3 rounded ${
              optionSelected ? "border-black" : ""
            }`}
            onPress={() => setOptionSelected(!optionSelected)}
          >
            <Text className="text-gray-600">
              {optionSelected
                ? "Factory Amp / Sub Activated ✔"
                : "Select option to activate factory Amp or Sub"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="bg-white mt-2 p-4">
          <View className="flex-row justify-between border-b pb-2">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`${
                    activeTab === tab
                      ? "text-black font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-4 min-h-32">{renderTabContent()}</View>
        </View>
      </ScrollView>

      {/* Add to Cart */}
      <TouchableOpacity className="bg-black py-4 items-center">
        <Text className="text-white font-bold text-lg">
          ADD TO CART — ${(1425 * qty).toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
