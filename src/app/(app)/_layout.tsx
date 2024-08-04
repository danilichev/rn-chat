import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, StyleSheet } from "react-native";

import { supabase } from "src/infra/supabase";

export default function AppLayout() {
  const [isAuthed, setAuthed] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;

      if (user) {
        supabase.auth.onAuthStateChange((_, session) => {
          setAuthed(!!session?.user);
        });

        AppState.addEventListener("change", (state) => {
          if (state === "active") {
            supabase.auth.startAutoRefresh();
          } else {
            supabase.auth.stopAutoRefresh();
          }
        });
      }

      setAuthed(!!user);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return <ActivityIndicator style={styles.container} />;
  }

  return isAuthed ? <Slot /> : <Redirect href="/sign-in" />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
});
