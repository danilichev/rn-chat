import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { createOneToOneChat, findOneToOneChatId, getChat } from "src/api/chats";
import { getUser } from "src/api/users";
import { PaginationResult } from "src/types/common";
import { User } from "src/types/domain";

type ScreenSearchParams = {
  chatId?: string;
  userId?: string;
};

export default function Chat() {
  const { chatId, userId } = useLocalSearchParams<ScreenSearchParams>();
  const queryClient = useQueryClient();

  const { data: chat, isPending: isChatPending } = useQuery({
    enabled: !!chatId,
    // initialData () => {}; TODO: Implement afeter adding chats query
    queryFn: ({ queryKey: [, id] }) => getChat({ id: id as string }),
    queryKey: ["chat", chatId],
  });

  const { data: user } = useQuery({
    enabled: !!userId,
    initialData: () =>
      queryClient
        .getQueryData<InfiniteData<PaginationResult<User>>>(["users"])
        ?.pages.flatMap((page) => page.data)
        .find((user) => user.id === userId),
    queryFn: ({ queryKey: [, id] }) => getUser({ id: id as string }),
    queryKey: ["user", userId],
  });

  const { mutateAsync: findOrCreateChat } = useMutation({
    mutationFn: async (userId: string) => {
      let chatId = await findOneToOneChatId({ userId });

      if (!chatId) {
        const chat = await createOneToOneChat({ userId });
        chatId = chat.id;
      }

      return chatId;
    },
    mutationKey: ["findOrCreateChat", userId],
    onSuccess: (chatId) => {
      if (chatId) {
        router.setParams({ chatId });
      }
    },
  });

  useEffect(() => {
    if (!chatId && userId) {
      findOrCreateChat(userId);
    }
  }, [chatId, findOrCreateChat, userId]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: user?.fullName }} />
      {isChatPending ? <ActivityIndicator /> : <Text>Chat {chat?.id}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
