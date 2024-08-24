import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { QueryClientProvider } from "src/services/queryClient";

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <QueryClientProvider>
        <Slot />
      </QueryClientProvider>
    </KeyboardProvider>
  );
}
