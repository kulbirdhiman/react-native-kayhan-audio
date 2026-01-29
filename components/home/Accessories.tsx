import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./homeStyle";
import { useNewgetAccessoriesProductsQuery } from "store/api/home/HomeAPi";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IMG_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

const Accessories = () => {
   const insets = useSafeAreaInsets();
  const { data, isLoading } = useNewgetAccessoriesProductsQuery({});
  const navigation = useNavigation<any>();

  if (isLoading) {
    return (
      <View style={styles.section}>
        <Text>Loading accessories...</Text>
      </View>
    );
  }

  const accessoriesArray = Object.values(data?.data?.result || []);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Accessories</Text>

      <View style={styles.grid}>
        {accessoriesArray.map((item: any, index: number) => {
          const product = item.data;

          const imagePath = product?.images?.[0]?.image;
          const imageUrl = imagePath
            ? `${IMG_BASE_URL}${imagePath}`
            : "https://via.placeholder.com/150";

          return (
            <TouchableOpacity
              key={product?.id ?? index}
              style={styles.accessoryCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  productId: product.slug, // 👈 pass slug or id
                })
              }
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.accImage}
                resizeMode="contain"
              />
              <Text style={styles.accText} numberOfLines={2}>
                {product.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Accessories;
