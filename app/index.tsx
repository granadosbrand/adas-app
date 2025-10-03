import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Auth from "../components/Auth";
import useAuthStore from "../store/useAuthStore";
import "./global.css";

export default function App() {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <Redirect href="/(drawer)/(tabs)/home" />;
}