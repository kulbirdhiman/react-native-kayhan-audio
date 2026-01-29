const IMG_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { styles } from "./homeStyle";
import { useNewgetRecommendedProductsQuery } from "store/api/home/HomeAPi";
import { useNavigation } from "@react-navigation/native";

const FeaturedProduct = () => {
  const { data, isLoading } = useNewgetRecommendedProductsQuery({});

  const products = data?.data?.result ?? [];

  if (isLoading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.section}>
        <Text>No products found</Text>
      </View>
    );
  }
  const navigation = useNavigation<any>();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Featured Products</Text>

      {products.map((item: any) => {
        const imagePath = item?.images?.[0]?.image;
        const imageUrl = imagePath
          ? `${IMG_BASE_URL}${imagePath}`
          : "https://via.placeholder.com/150";

        return (
          <View key={item.id} style={styles.productCard}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />

            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.productPrice}>
                ${item.regular_price}
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { productId: item.slug })} style={styles.shopBtn}>
                <Text style={styles.shopText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default FeaturedProduct;
