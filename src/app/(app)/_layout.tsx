import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Slot } from "expo-router";
import { Stack } from "expo-router/stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, StyleSheet } from "react-native";

import { supabase } from "src/infra/supabase";

export default function AppLayout() {
  const [isAuthed, setAuthed] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // supabase.auth.signOut();

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;

      if (user) {
        console.log("user", JSON.stringify(user, null, 2));
        AsyncStorage.setItem("rn-chat-user-id", user.id);

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
      } else {
        AsyncStorage.removeItem("rn-chat-user-id");
      }

      setAuthed(!!user);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return <ActivityIndicator style={styles.container} />;
  }

  return isAuthed ? (
    <Stack screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen name="index" options={{ title: "Chats" }} />
      <Stack.Screen name="start-chat" options={{ title: "Start Chat" }} />
    </Stack>
  ) : (
    <Redirect href="/sign-in" />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
});
