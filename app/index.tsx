import useUserStore from "@/store/useUserStore";
import { Redirect } from "expo-router";
import "./global.css";

export default function App() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  // Redirigir según el estado de autenticación
  if (isAuthenticated) {
    return <Redirect href='/(drawer)/(tabs)/home' />;
  }

  return <Redirect href='/auth' />;
}