import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import ProductScreen from 'components/productScreen';

export default function App() {
  return (
    <>
      {/* <ScreenContent title="Home" path="App.tsx"></ScreenContent> */}
      <ProductScreen />
      <StatusBar style="auto" />
    </>
  );
}
