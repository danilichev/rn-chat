import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const startChatIcon = { color: "white", name: "edit-3", type: "feather" };

export default function Home() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  const onPressStartChatButton = () => {
    router.navigate("/start-chat");
  };

  // TODO: add loading users chats

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
            icon={startChatIcon}
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
