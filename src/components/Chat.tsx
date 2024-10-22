import { Icon, Input } from "@rneui/themed";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface ChatProps {
  isLoading?: boolean;
}

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

        height.value = e.height;
      },
      onEnd: (e) => {
        "worklet";

        height.value = e.height;
      },
    },
    [],
  );

  return { height };
};

export const Chat = (props: ChatProps) => {
  const { height } = useGradualAnimation();

  const underKeyboardView1 = useAnimatedStyle(() => ({
    height: Math.abs(height.value),
  }));

  return (
    <View style={styles.container}>
      <FlatList style={styles.messageList} data={[]} renderItem={() => null} />
      <Input
        inputContainerStyle={{ borderBottomWidth: 0 }}
        rightIcon={
          <Icon
            Component={TouchableOpacity}
            color="#546E7A"
            name="send"
            style={styles.sendIcon}
            type="feather"
          />
        }
        placeholder="Type a message"
      />
      <Animated.View style={underKeyboardView1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  messageList: {
    backgroundColor: "#CFD8DC",
  },
  sendIcon: {
    transform: [{ rotate: "15deg" }],
    width: 40,
  },
});
