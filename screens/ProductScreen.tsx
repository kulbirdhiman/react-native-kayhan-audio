import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

export default function ProductScreen() {
  return (
    <View className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View className="bg-white p-4">
          <Image
            source={{
              uri: "https://dummyimage.com/600x400/000/fff&text=Car+Stereo",
            }}
            className="w-full h-56 rounded-lg"
            resizeMode="contain"
          />

          {/* Thumbnails */}
          <View className="flex-row justify-center mt-4 space-x-3">
            {[1, 2, 3].map((_, i) => (
              <Image
                key={i}
                source={{
                  uri: "https://dummyimage.com/100x80/000/fff",
                }}
                className="w-20 h-14 rounded-md border border-gray-300"
              />
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

          {/* Quantity */}
          <View className="flex-row items-center mt-4">
            <TouchableOpacity className="border px-4 py-2 rounded">
              <Text className="text-lg">-</Text>
            </TouchableOpacity>

            <Text className="mx-4 text-lg">1</Text>

            <TouchableOpacity className="border px-4 py-2 rounded">
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
          </View>

          {/* Options */}
          <TouchableOpacity className="border mt-4 p-3 rounded">
            <Text className="text-gray-600">
              Select option to activate factory Amp or Sub
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="bg-white mt-2 p-4">
          <View className="flex-row justify-between border-b pb-2">
            {["Description", "Specification", "Demo video", "Review"].map(
              (tab, i) => (
                <Text
                  key={i}
                  className={`${
                    i === 0
                      ? "text-black font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {tab}
                </Text>
              )
            )}
          </View>

          {/* Description */}
          <View className="mt-4">
            <Text className="font-bold text-black mb-2">
              Product Specifications
            </Text>

            <Text className="text-gray-700">
              • Qualcomm QCM6125 64-bit ARM v8.0 Octa-Core Processor (Kryo 260)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart */}
      <TouchableOpacity className="bg-black py-4 items-center">
        <Text className="text-white font-bold text-lg">
          ADD TO CART — $19.49
        </Text>
      </TouchableOpacity>
    </View>
  );
}
