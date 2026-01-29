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
import {
  useGetRootCarModelsByCategoryQuery,
  useGetChildrenByParentIdQuery,
} from "store/api/category/carModelAPi";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    company: number | null;
    model: number | null;
    year: string | null;
  }) => void;
}

export default function ProductFilterSidebar({
  visible,
  onClose,
  onApply,
}: Props) {
  const slide = useState(new Animated.Value(-SCREEN_WIDTH))[0];

  const [step, setStep] = useState<"make" | "model" | "submodel" | "year">(
    "make"
  );

  const [makes, setMakes] = useState<any[]>([]);
  const [selectedMake, setSelectedMake] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedSubmodel, setSelectedSubmodel] = useState<any>(null);
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  useEffect(() => {
    axios
      .get("https://api.kayhanaudio.com.au/v1/category/list", {
        params: { type: 1 },
      })
      .then((res) => setMakes(res.data.data.result));
  }, []);

  const { data: models } = useGetRootCarModelsByCategoryQuery(
    selectedMake?.id || 0,
    { skip: !selectedMake }
  );

  const { data: submodels } = useGetChildrenByParentIdQuery(
    selectedModel?.id || 0,
    { skip: !selectedModel }
  );

  const applyFilters = (
    make = selectedMake,
    model = selectedSubmodel || selectedModel,
    year: string | null = null
  ) => {
    onApply({
      company: make?.slug || null,
      model: model?.slug || null,
      year,
    });
    onClose();
  };

  const clearFilters = () => {
    setSelectedMake(null);
    setSelectedModel(null);
    setSelectedSubmodel(null);
    setSelectedYear(null);
    setYears([]);
    setStep("make");

    onApply({
      company: null,
      model: null,
      year: null,
    });
    onClose();
  };

  const fetchYears = async (id: number) => {
    const res = await axios.get(
      `https://api.kayhanaudio.com.au/v1/car_model/detail/${id}`
    );

    const result = res.data.data.result || [];
    setYears(result);

    if (result.length === 0) {
      applyFilters();
    } else {
      setStep("year");
    }
  };

  const goBack = () => {
    if (step === "year") {
      setSelectedYear(null);
      setStep("submodel");
    } else if (step === "submodel") {
      setSelectedSubmodel(null);
      setStep("model");
    } else if (step === "model") {
      setSelectedModel(null);
      setStep("make");
    }
  };

  return (
    <Animated.View style={[styles.sidebar, { left: slide }]}>
      {/* HEADER */}
      <View style={styles.header}>
        {step !== "make" ? (
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <Text style={styles.title}>Filters</Text>

        <TouchableOpacity onPress={onClose}>
          <Text>✕</Text>
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <ScrollView>
        {step === "make" &&
          makes.map((m) => (
            <Item
              key={m.id}
              label={m.name}
              onPress={() => {
                setSelectedMake(m);
                setStep("model");
              }}
            />
          ))}

        {step === "model" &&
          models?.map((m: any) => (
            <Item
              key={m.id}
              label={m.name}
              onPress={() => {
                setSelectedModel(m);

                if (!m.has_children) {
                  applyFilters(selectedMake, m, null);
                } else {
                  setStep("submodel");
                }
              }}
            />
          ))}

        {step === "submodel" &&
          submodels?.map((s) => (
            <Item
              key={s.id}
              label={s.name}
              onPress={() => {
                setSelectedSubmodel(s);
                fetchYears(s.id);
              }}
            />
          ))}

        {step === "year" &&
          years.map((y) => (
            <Item
              key={y.id}
              label={y.name}
              onPress={() => {
                setSelectedYear(y.name);
                applyFilters(selectedMake, selectedSubmodel, y.name);
              }}
            />
          ))}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} onPress={() => applyFilters()}>
          <Text style={{ color: "#FFF" }}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const Item = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text>{label}</Text>
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
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 40,
  },
  back: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: { fontSize: 23, fontWeight: "700" },
  item: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  clearText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
