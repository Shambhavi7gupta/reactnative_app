// App.js
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import ProductList from "./components/ProductList";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ProductList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
