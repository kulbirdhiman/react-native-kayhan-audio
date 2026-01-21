import { View, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Navbar() {
  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center h-[56px] px-3 border-b border-gray-200">
        
        {/* LEFT : Logo */}
        <Image
          source={{
            uri: "https://kayhanaudio.com.au/_next/image?url=%2Flogo.webp&w=256&q=75",
          }}
          className="w-[70px] h-[40px] bg-white"
          resizeMode="contain"
        />

        {/* RIGHT : Search + Bell */}
        <View className="flex-row items-center flex-1 justify-end ml-3">
          
          {/* Search */}
          <View className="flex-row items-center bg-gray-100 h-[36px] w-[200px] rounded-full px-3 mr-3">
            <Ionicons name="search" size={18} color="gray" />
            <TextInput
              placeholder="Value"
              placeholderTextColor="#888"
              className="flex-1 ml-2 text-sm"
            />
          </View>

          {/* Bell */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}
