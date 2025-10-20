import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, AppState, AppStateStatus } from "react-native";
import * as Updates from "expo-updates";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

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
  // Verificar actualizaciones al montar la aplicación
  useEffect(() => {
    checkForUpdates();

    // Opcional: Verificar actualizaciones cada vez que la app vuelva a primer plano
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          checkForUpdates();
        }
      }
    );

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      // Intentamos usar la nueva API primero
      if (typeof subscription?.remove === "function") {
        subscription.remove();
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
