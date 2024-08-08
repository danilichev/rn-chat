import { StyleSheet, Text, View } from "react-native";

export default function StartChat() {
  return (
    <View style={styles.container}>
      <Text>Start Chat</Text>
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
