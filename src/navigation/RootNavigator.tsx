import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import LoadingScreen from "../components/LoadingScreen";
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import PendingScreen from "../screens/PendingScreen";

export default function RootNavigator() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated
  if (!token || !user) {
    return <AuthNavigator />;
  }

  // Profile not yet completed
  if (!user.profile_completed) {
    return <CompleteProfileScreen />;
  }

  // Awaiting admin approval
  if (user.status === "PENDING") {
    return <PendingScreen />;
  }

  // Fully active → main app
  return <AppNavigator />;
}
