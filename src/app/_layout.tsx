import { Slot } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

import { supabase } from "src/infra/supabase";

export default function RootLayout() {
  useEffect(() => {
    AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
  }, []);

  return <Slot />;
}
