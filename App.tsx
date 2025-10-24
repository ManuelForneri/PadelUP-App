import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  AppStateStatus,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

async function checkForUpdates() {
  if (__DEV__) {
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();

      // Mostrar alerta al usuario
      Alert.alert(
        "¡Nueva actualización!",
        "Hay una nueva versión disponible. ¿Deseas reiniciar la aplicación para aplicar los cambios?",
        [
          {
            text: "Ahora no",
            style: "cancel",
          },
          {
            text: "Reiniciar",
            onPress: () => Updates.reloadAsync(),
          },
        ]
      );
    }
  } catch (error) {
    console.error("Error al verificar actualizaciones:", error);
  }
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = useFonts({
    Adoriademo: require("./src/assets/fonts/Adoriademo.otf"),
  });

  useEffect(() => {
    checkForUpdates();

    if (loaded || error) {
      SplashScreen.hideAsync();
    }

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          checkForUpdates();
        }
      }
    );

    return () => {
      if (typeof subscription?.remove === "function") {
        subscription.remove();
      }
    };
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
