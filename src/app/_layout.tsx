import { Slot } from "expo-router";

import { QueryClientProvider } from "src/services/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider>
      <Slot />
    </QueryClientProvider>
  );
}
