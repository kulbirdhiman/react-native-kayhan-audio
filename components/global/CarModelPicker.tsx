import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

interface Category { id: number; name: string; }
interface CarModel { id: number; name: string; slug?: string; has_children?: boolean; }
interface Year { id: number; name: string; }

interface Props {
  onSelect?: (selection: { make: string; model: string; submodel?: string; year?: string }) => void;
}

export default function CarModelPicker({ onSelect }: Props) {
  const [step, setStep] = useState<"make" | "model" | "submodel" | "year">("make");

  const [makes, setMakes] = useState<Category[]>([]);
  const [selectedMake, setSelectedMake] = useState<Category | null>(null);
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [selectedSubmodel, setSelectedSubmodel] = useState<CarModel | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [models, setModels] = useState<CarModel[]>([]);
  const [submodels, setSubmodels] = useState<CarModel[]>([]);
  const [years, setYears] = useState<Year[]>([]);

  const [loading, setLoading] = useState(false);

  // ---------------- FETCH MAKES ----------------
  const fetchMakes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://api.kayhanaudio.com.au/v1/category/list", { params: { type: 1 } });
      setMakes(res.data.data.result.sort((a: Category, b: Category) => a.name.localeCompare(b.name)));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMakes(); }, []);

  // ---------------- FETCH MODELS ----------------
  const fetchModels = async (makeId: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.kayhanaudio.com.au/v1/car_model/root/${makeId}`);
      setModels(res.data.data.result || []);
      setSelectedModel(null);
      setSubmodels([]);
      setSelectedSubmodel(null);
      setYears([]);
      setSelectedYear(null);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // ---------------- FETCH SUBMODELS ----------------
  const fetchSubmodels = async (modelId: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.kayhanaudio.com.au/v1/car_model/children/${modelId}`);
      if (res.data.data.result.length > 0) {
        setSubmodels(res.data.data.result);
        setStep("submodel");
      } else {
        fetchYears(modelId);
      }
      setSelectedSubmodel(null);
      setYears([]);
      setSelectedYear(null);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // ---------------- FETCH YEARS ----------------
  const fetchYears = async (modelId: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://api.kayhanaudio.com.au/v1/car_model/detail/${modelId}`);
      setYears(res.data.data.result || []);
      setStep("year");
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // ---------------- HANDLERS ----------------
  const handleMakeSelect = (make: Category) => {
    setSelectedMake(make);
    setStep("model");
    fetchModels(make.id);
  };

  const handleModelSelect = (model: CarModel) => {
    setSelectedModel(model);
    fetchSubmodels(model.id);
  };

  const handleSubmodelSelect = (submodel: CarModel) => {
    setSelectedSubmodel(submodel);
    fetchYears(submodel.id);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    onSelect?.({
      make: selectedMake!.name,
      model: selectedModel!.name,
      submodel: selectedSubmodel?.name,
      year,
    });
  };

  const handleBack = () => {
    if (step === "year") setStep(selectedSubmodel ? "submodel" : "model");
    else if (step === "submodel") setStep("model");
    else if (step === "model") setStep("make");
  };

  const renderItem = (item: any, onSelect: (item: any) => void) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const isLoading = loading;

  // ---------------- RENDER ----------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Car</Text>

      {selectedMake && selectedModel && (
        <Text style={styles.selectedText}>
          Selected: {selectedMake.name} {selectedModel.name} {selectedSubmodel?.name || ""} {selectedYear || ""}
        </Text>
      )}

      {step !== "make" && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Back</Text>
        </TouchableOpacity>
      )}

      {isLoading && <ActivityIndicator size="large" color="#007AFF" />}

      <ScrollView style={styles.scroll}>
        {step === "make" && makes.map((m) => renderItem(m, handleMakeSelect))}
        {step === "model" && models.map((m) => renderItem(m, handleModelSelect))}
        {step === "submodel" && submodels.map((s) => renderItem(s, handleSubmodelSelect))}
        {step === "year" && years.map((y) => renderItem(y, () => handleYearSelect(y.name)))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F9F9" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  selectedText: { fontSize: 16, marginBottom: 10, textAlign: "center", color: "#555" },
  backButton: { marginBottom: 12, padding: 8, alignSelf: "flex-start" },
  backText: { color: "#007AFF", fontWeight: "600" },
  scroll: { maxHeight: "70%" },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: { fontSize: 16 },
});
