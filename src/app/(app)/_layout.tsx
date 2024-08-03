import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { supabase } from "src/infra/supabase";

export default function AppLayout() {
  const [isAuthed, setAuthed] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setLoading(false);

      supabase.auth.signOut();
    });

    supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
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
