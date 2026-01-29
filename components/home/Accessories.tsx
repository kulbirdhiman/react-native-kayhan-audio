import { View, Text, Image } from "react-native";
import React from "react";
import { styles } from "./homeStyle";
import { useNewgetAccessoriesProductsQuery } from "store/api/home/HomeAPi";

const IMG_BASE_URL = "https://d198m4c88a0fux.cloudfront.net/";

const Accessories = () => {
  const { data, isLoading } = useNewgetAccessoriesProductsQuery({});

  if (isLoading) {
    return (
      <View style={styles.section}>
        <Text>Loading accessories...</Text>
      </View>
    );
  }

  // ✅ Convert object → array
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
            <View key={product.id ?? index} style={styles.accessoryCard}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.accImage}
                resizeMode="contain"
              />
              <Text style={styles.accText} numberOfLines={2}>
                {product.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Accessories;
