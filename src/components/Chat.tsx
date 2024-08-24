import { Input } from "@rneui/themed";
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from "react-native";

interface ChatProps {
  isLoading?: boolean;
}

export const Chat = (props: ChatProps) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <FlatList style={styles.main} data={[]} renderItem={() => null} /> */}
      <View style={styles.main} />
      <Input placeholder="Type a message" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    backgroundColor: "pink",
    flex: 1,
  },
});
