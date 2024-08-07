import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { supabase } from "src/infra/supabase";

export default function Home() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      const userId = await AsyncStorage.getItem("rn-chat-user-id");

      if (!userId) {
        setLoading(false);
        return;
      }

      console.log("userId", userId);

      const { data, error } = await supabase
        .from("users")
        .select(`avatar_url, email, full_name`)
        .eq("id", userId)
        .single();

      console.log(data, error);

      setLoading(false);
    }

    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      {isLoading ? <ActivityIndicator /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
