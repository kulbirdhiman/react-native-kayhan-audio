// import { Container } from "components/Container";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useListProductForShopQuery } from "store/api/product/productApi";

const IMG_URL = "https://d198m4c88a0fux.cloudfront.net/";

const DigitalClusterSection = () => {
  const { data, isLoading, isError } = useListProductForShopQuery({
    page: 1,
    limit: 10,
    category: "digital-instrument-cluster",
  });

  if (isLoading) return <ActivityIndicator size="large" />;
  if (isError) return <Text>Something went wrong</Text>;

  return (
    <View  > 
      <Text style={styles.sectionTitle}>Digital instrument cluster</Text>

      <FlatList
        data={data?.data?.result || []}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {/* Image */}
            <Image
              source={{
                uri: item.images?.[0]?.image
                  ? IMG_URL + item.images[0].image
                  : undefined,
              }}
              style={styles.image}
            />

            {/* Title */}
            <Text numberOfLines={2} style={styles.title}>
              {item.name}
            </Text>

            {/* Price */}
            <Text style={styles.price}>${item.regular_price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DigitalClusterSection;
const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 14,
    padding: 10,
    elevation: 4,
  },
  // container : {
  //   padding: 30
  // },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft : 20
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e88e5",
    marginTop: 4,
  },
});
