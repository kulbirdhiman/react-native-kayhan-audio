import StackNavigator from "navigation/StackNavigator";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";

import { setCredentials } from "store/api/auth/authSlice";
import store, { persistor } from "store/store";
import { loadAuth } from "store/utils/authStorage";

const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuth = async () => {
      const { token, user } = await loadAuth();
      if (token) {
        dispatch(setCredentials({ token, user }));
      }
    };
    restoreAuth();
  }, []);

  return <StackNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 🔥 Wrap your navigator here */}
        <NavigationContainer>
          <AuthBootstrap />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
