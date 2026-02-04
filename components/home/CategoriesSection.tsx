import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CATEGORY_DATA } from "../../data/homedata";

const { width } = Dimensions.get("window");

// Split array into chunks of 4
const chunkArray = (arr: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function CategoriesSection() {
  const navigation = useNavigation<any>();
  const chunks = chunkArray(CATEGORY_DATA, 4);

  const handleCategoryPress = (category: string) => {
    navigation.navigate("Search", {
      category, // 👈 send category here
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Categories</Text>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {chunks.map((group, index) => (
          <View key={index} style={styles.page}>
            {group.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.card}
                onPress={() => handleCategoryPress(item.slug || item.title)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.text}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  page: {
    width: width - 32, // same as section padding
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },

  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  text: {
    marginTop: 6,
    fontWeight: "600",
    textAlign: "center",
  },
});
