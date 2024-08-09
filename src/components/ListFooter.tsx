import { ActivityIndicator, StyleSheet, View } from "react-native";

interface ListFooterProps {
  isLoading?: boolean;
}

export const ListFooter = ({ isLoading }: ListFooterProps) => {
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
  },
});
