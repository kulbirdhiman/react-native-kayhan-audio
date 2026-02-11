import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  useGetRootCarModelsByCategoryQuery,
  useGetChildrenByParentIdQuery,
} from "store/api/category/carModelAPi";

export default function BatterySelector() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [batteryCategory, setBatteryCategory] = useState<any>(null);
  const [selectedMake, setSelectedMake] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [years, setYears] = useState<any[]>([]);
  const [loadingYears, setLoadingYears] = useState(false);

  /* ---------------- GET BATTERY CATEGORY ---------------- */
  useEffect(() => {
    axios
      .get("https://api.kayhanaudio.com.au/v1/category/list", {
        params: { type: 1 },
      })
      .then((res) => {
        const result = res?.data?.data?.result || [];
        const battery = result.find((item: any) =>
          item.name.toLowerCase().includes("battery")
        );
        setBatteryCategory(battery);
      })
      .catch((err) => console.log("Battery Category Error", err));
  }, []);

  /* ---------------- FETCH MAKES ---------------- */
  const { data: makes } = useGetRootCarModelsByCategoryQuery(
    batteryCategory?.id || 0,
    { skip: !batteryCategory }
  );

  /* ---------------- FETCH MODELS ---------------- */
  const { data: models } = useGetChildrenByParentIdQuery(
    selectedMake?.id || 0,
    { skip: !selectedMake }
  );

  /* ---------------- FETCH YEARS ---------------- */
  useEffect(() => {
    const fetchYears = async () => {
      if (!selectedModel) return;

      setLoadingYears(true);

      try {
        const res = await axios.get(
          `https://api.kayhanaudio.com.au/v1/car_model/detail/${selectedModel.id}`
        );

        const result = res?.data?.data?.result ?? [];
        setYears(result);
      } catch (error) {
        console.log("Year Fetch Error", error);
      }

      setLoadingYears(false);
    };

    fetchYears();
  }, [selectedModel]);

  /* ---------------- AUTO NAVIGATION ---------------- */
  useEffect(() => {
    if (selectedYear) {
      navigation.navigate("MainTabs", {
        screen: "Search",
        params: {
          company: batteryCategory?.slug,
          make: selectedMake?.slug,
          model: selectedModel?.slug,
          year: selectedYear,
        },
      });
    }
  }, [selectedYear]);

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View
        style={[
          styles.containerRow,
          { flexDirection: isSmallScreen ? "column" : "row" },
        ]}
      >
        {/* LEFT IMAGE SECTION */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png",
            }}
            style={styles.batteryImage}
            resizeMode="contain"
          />
          <Text style={styles.imageText}>Premium Car Batteries</Text>
        </View>

        {/* RIGHT SELECTOR CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>Find Your Battery</Text>

          {/* MAKE */}
          <Text style={styles.label}>Select Make</Text>
          <View style={styles.selectBox}>
            <Picker
              selectedValue={selectedMake}
              onValueChange={(itemValue) => {
                setSelectedMake(itemValue);
                setSelectedModel(null);
                setSelectedYear(null);
              }}
            >
              <Picker.Item label="Choose Make" value={null} />
              {makes?.map((m: any) => (
                <Picker.Item key={m.id} label={m.name} value={m} />
              ))}
            </Picker>
          </View>

          {/* MODEL */}
          {selectedMake && (
            <>
              <Text style={styles.label}>Select Model</Text>
              <View style={styles.selectBox}>
                <Picker
                  selectedValue={selectedModel}
                  onValueChange={(itemValue) => {
                    setSelectedModel(itemValue);
                    setSelectedYear(null);
                  }}
                >
                  <Picker.Item label="Choose Model" value={null} />
                  {models?.map((m: any) => (
                    <Picker.Item key={m.id} label={m.name} value={m} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* YEAR */}
          {selectedModel && (
            <>
              <Text style={styles.label}>Select Year</Text>
              <View style={styles.selectBox}>
                {loadingYears ? (
                  <ActivityIndicator style={{ padding: 15 }} />
                ) : (
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) =>
                      setSelectedYear(itemValue)
                    }
                  >
                    <Picker.Item label="Choose Year" value={null} />
                    {years.map((y: any) => (
                      <Picker.Item
                        key={y.id}
                        label={y.name}
                        value={y.name}
                      />
                    ))}
                  </Picker>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 30,
  },

  containerRow: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },

  imageContainer: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  batteryImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
    tintColor: "#FFD700",
  },

  imageText: {
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },

  card: {
    flex: 2,
    padding: 20,
    backgroundColor: "#FFF",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#444",
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 5,
    overflow: "hidden",
  },
});
