import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <Text style={styles.logo}>🏓</Text>
      <Text style={styles.title}>Padel UP</Text>
      <ActivityIndicator color="#00D9A6" size="large" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#00D9A615",
    top: -60,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#007AFF10",
    bottom: -50,
    left: -60,
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginBottom: 32,
  },
  spinner: {
    marginTop: 8,
  },
});
