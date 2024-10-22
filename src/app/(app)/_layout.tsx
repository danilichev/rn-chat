import { Icon } from "@rneui/themed";
import { Redirect, useNavigation } from "expo-router";
import { Stack } from "expo-router/stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { supabase } from "src/services/supabase";

export default function AppLayout() {
  const navigation = useNavigation();

  const [isAuthed, setAuthed] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // supabase.auth.signOut();

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

  return isAuthed ? (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Icon
              Component={TouchableOpacity}
              color="#546E7A"
              name="chevron-left"
              onPress={navigation.goBack}
              size={32}
            />
          ) : null,
      }}
    >
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
