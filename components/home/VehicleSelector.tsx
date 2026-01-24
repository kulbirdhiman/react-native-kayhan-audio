import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { VEHICLE_DATA } from "../../data/homedata";

type Step = "company" | "model" | "subModel" | "year";

export default function VehicleSelector() {
  const [company, setCompany] = React.useState<string | null>(null);
  const [model, setModel] = React.useState<string | null>(null);
  const [subModel, setSubModel] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<Step>("company");

  const resetBelow = () => {
    setModel(null);
    setSubModel(null);
    setYear(null);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Select Vehicle</Text>

      {(company || model || subModel || year) && (
        <Text style={styles.selected}>
          {company} {model} {subModel} {year}
        </Text>
      )}

      {step === "company" && (
        <View style={styles.row}>
          {Object.keys(VEHICLE_DATA).map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.card}
              onPress={() => {
                setCompany(item);
                resetBelow();
                setStep("model");
              }}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === "model" && company && (
        <View style={styles.row}>
          {Object.keys(VEHICLE_DATA[company]).map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.card}
              onPress={() => {
                setModel(item);
                setStep("subModel");
              }}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === "subModel" && company && model && (
        <View style={styles.row}>
          {Object.keys(VEHICLE_DATA[company][model]).map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.card}
              onPress={() => {
                setSubModel(item);
                setStep("year");
              }}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === "year" && company && model && subModel && (
        <View style={styles.row}>
          {VEHICLE_DATA[company][model][subModel].map((item: string) => (
            <TouchableOpacity
              key={item}
              style={styles.card}
              onPress={() => setYear(item)}
            >
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: 16 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  selected: { marginBottom: 10, color: "#555" },
  row: { flexDirection: "row", flexWrap: "wrap" },
  card: {
    width: "48%",
    padding: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  text: { fontWeight: "600" },
});
