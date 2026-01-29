import * as SecureStore from "expo-secure-store";

// Only store token in SecureStore
export const saveAuth = async (token: string) => {
  await SecureStore.setItemAsync("token", token);
};

export const loadAuth = async () => {
  const token = await SecureStore.getItemAsync("token");
  return { token };
};

export const clearAuth = async () => {
  await SecureStore.deleteItemAsync("token");
};
