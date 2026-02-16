import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Country, State, City } from "country-state-city";
import { Dropdown } from "react-native-element-dropdown";

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  selectedCountry: any;
  selectedState: any;
  selectedCity: string;
  postcode: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setStreet: (v: string) => void;
  setSelectedCountry: (v: any) => void;
  setSelectedState: (v: any) => void;
  setSelectedCity: (v: string) => void;
  setPostcode: (v: string) => void;
}

export default function AddressStep(props: Props) {
  const countries = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c,
      })),
    []
  );

  const states = useMemo(
    () =>
      props.selectedCountry
        ? State.getStatesOfCountry(props.selectedCountry.isoCode).map((s) => ({
            label: s.name,
            value: s,
          }))
        : [],
    [props.selectedCountry]
  );

  const cities = useMemo(
    () =>
      props.selectedCountry && props.selectedState
        ? City.getCitiesOfState(
            props.selectedCountry.isoCode,
            props.selectedState.isoCode
          ).map((c) => ({
            label: c.name,
            value: c.name,
          }))
        : [],
    [props.selectedCountry, props.selectedState]
  );

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>

      <TextInput placeholder="First Name" style={styles.input} value={props.firstName} onChangeText={props.setFirstName} />
      <TextInput placeholder="Last Name" style={styles.input} value={props.lastName} onChangeText={props.setLastName} />
      <TextInput placeholder="Email" style={styles.input} value={props.email} onChangeText={props.setEmail} keyboardType="email-address" />
      <TextInput placeholder="Phone" style={styles.input} value={props.phone} onChangeText={props.setPhone} keyboardType="phone-pad" />

      {/* COUNTRY */}
      <Dropdown
        style={styles.dropdown}
        data={countries}
        labelField="label"
        valueField="value"
        placeholder="Select Country"
        value={props.selectedCountry}
        onChange={(item) => {
          props.setSelectedCountry(item.value);
          props.setSelectedState(null);
          props.setSelectedCity("");
        }}
      />

      {/* STATE */}
      {props.selectedCountry && (
        <Dropdown
          style={styles.dropdown}
          data={states}
          labelField="label"
          valueField="value"
          placeholder="Select State"
          value={props.selectedState}
          onChange={(item) => {
            props.setSelectedState(item.value);
            props.setSelectedCity("");
          }}
        />
      )}

      {/* CITY */}
      {props.selectedState && (
        <Dropdown
          style={styles.dropdown}
          data={cities}
          labelField="label"
          valueField="value"
          placeholder="Select City"
          value={props.selectedCity}
          onChange={(item) => props.setSelectedCity(item.value)}
        />
      )}

      <TextInput placeholder="Street Address" style={styles.input} value={props.street} onChangeText={props.setStreet} />
      <TextInput placeholder="Postcode" style={styles.input} value={props.postcode} onChangeText={props.setPostcode} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", margin: 16, padding: 20, borderRadius: 22 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  input: { backgroundColor: "#F9FAFB", borderRadius: 16, padding: 15, marginBottom: 14, borderWidth: 1, borderColor: "#E5E7EB" },
  dropdown: { height: 55, borderRadius: 16, paddingHorizontal: 15, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 14 },
});
