import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

import { queryClient } from "src/infra/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
