import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';

import Routes from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={{
        flex: 1,
      }}>
        <Routes />
      </SafeAreaView>
    </>
  );
}
