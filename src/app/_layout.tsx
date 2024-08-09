import { Slot } from "expo-router";

import { QueryClientProvider } from "src/infra/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider>
      <Slot />
    </QueryClientProvider>
  );
}
