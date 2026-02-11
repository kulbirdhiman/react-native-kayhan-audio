import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  useGetRootCarModelsByCategoryQuery,
  useGetChildrenByParentIdQuery,
} from "store/api/category/carModelAPi";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SearchMenu({ visible, onClose }: Props) {
  const navigation = useNavigation<any>();
  const slide = useState(new Animated.Value(-SCREEN_WIDTH))[0];

  const [step, setStep] = useState<"category" | "make" | "model" | "year">(
    "category"
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedMake, setSelectedMake] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [years, setYears] = useState<any[]>([]);

  /* Slide animation */
  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  /* Load categories */
  useEffect(() => {
    axios
      .get("https://api.kayhanaudio.com.au/v1/category/list", {
        params: { type: 1 },
      })
      .then((res) => setCategories(res.data.data.result || []));
  }, []);

  const { data: makes } = useGetRootCarModelsByCategoryQuery(
    selectedCategory?.id || 0,
    { skip: !selectedCategory }
  );

  const { data: models } = useGetChildrenByParentIdQuery(
    selectedMake?.id || 0,
    { skip: !selectedMake }
  );

  /* 👉 AUTO NAVIGATE if NO MODELS */
  useEffect(() => {
    if (step === "model" && selectedMake && models && models.length === 0) {
      goToSearch(null);
    }
  }, [models, step, selectedMake]);

  /* Fetch years */
  const fetchYears = async (modelId: number) => {
    const res = await axios.get(
      `https://api.kayhanaudio.com.au/v1/car_model/detail/${modelId}`
    );

    const result = res?.data?.data?.result ?? [];

    if (result.length === 0) {
      goToSearch(null); // 👉 no years
    } else {
      setYears(result);
      setStep("year");
    }
  };

  const goBack = () => {
    if (step === "year") {
      setStep("model");
    } else if (step === "model") {
      setSelectedMake(null);
      setStep("make");
    } else if (step === "make") {
      setSelectedCategory(null);
      setStep("category");
    }
  };

  /* ✅ CORRECT TAB NAVIGATION */

  const goToSearch = (year: string | null) => {
    onClose();
    console.log({
      company: selectedCategory?.slug,
      make: selectedMake?.slug || null,
      model: selectedModel?.slug || null,
      year,
    },)
    setStep("category");

    navigation.navigate("MainTabs", {
      screen: "Search",
      params: {
        company: selectedCategory?.slug,
        make: selectedMake?.slug,
        model: selectedModel?.slug,
        year,
      },
    });
  };


  return (
    <Animated.View style={[styles.sidebar, { left: slide }]}>
      {/* HEADER */}
      <View style={styles.header}>
        {step !== "category" ? (
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <Text style={styles.title}>Search Menu</Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <ScrollView>
        {/* CATEGORY */}
        {step === "category" &&
          categories.map((c) => (
            <MenuItem
              key={c.id}
              label={c.name}
              onPress={() => {
                setSelectedCategory(c);
                setStep("make");
              }}
            />
          ))}

        {/* MAKE */}
        {step === "make" &&
          makes?.map((m: any) => (
            <MenuItem
              key={m.id}
              label={m.name}
              onPress={() => {
                setSelectedMake(m);
                setStep("model");
              }}
            />
          ))}

        {/* MODEL */}
        {step === "model" &&
          models?.map((m: any) => (
            <MenuItem
              key={m.id}
              label={m.name}
              onPress={() => {
                setSelectedModel(m);
                fetchYears(m.id);
              }}
            />
          ))}

        {/* YEAR */}
        {step === "year" &&
          years.map((y) => (
            <MenuItem
              key={y.id}
              label={y.name}
              onPress={() => goToSearch(y.name)}
            />
          ))}
      </ScrollView>
    </Animated.View>
  );
}

const MenuItem = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "80%",
    backgroundColor: "#FFF",
    zIndex: 100,
    padding: 16,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  back: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  item: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
