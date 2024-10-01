import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/Appnavigator';

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
