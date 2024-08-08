import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { supabase } from "src/infra/supabase";

export default function Home() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  const onPressStartChatButton = () => {
    router.navigate("/start-chat");
  };

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
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text>Home</Text>
          <Button
            buttonStyle={styles.startChatButton}
            containerStyle={styles.startChatButtonContainer}
            icon={{ color: "white", name: "edit-3", type: "feather" }}
            iconContainerStyle={styles.startChatButtonIconContainer}
            onPress={onPressStartChatButton}
          />
        </>
      )}
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
  startChatButton: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  startChatButtonContainer: {
    bottom: 40,
    position: "absolute",
    right: 20,
  },
  startChatButtonIconContainer: {
    height: 20,
    width: 20,
  },
});
