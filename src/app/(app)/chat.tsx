import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import {
  createOneToOneChat,
  findOneToOneChatId,
  getChat,
} from "src/features/chats/api";
import { Chat } from "src/features/chats/components/Chat";
import { ChatPreview } from "src/features/chats/types";
import { getUser } from "src/features/users/api";
import { User } from "src/features/users/types";
import { Pagination, PaginationResult } from "src/types/common";

type ScreenSearchParams = {
  chatId?: string;
  userId?: string;
};

export default function ChatScreen() {
  const { chatId, userId } = useLocalSearchParams<ScreenSearchParams>();
  const queryClient = useQueryClient();

  const { data: chat, isPending: isChatPending } = useQuery({
    enabled: !!chatId,
    initialData: queryClient
      .getQueryData<InfiniteData<PaginationResult<ChatPreview>>>(["chats"])
      ?.pages.flatMap((page) => page.data)
      .find((chat) => chat.id === chatId),
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

        const user = queryClient.getQueryData<User>(["user", userId]);

        if (!user) return;

        queryClient.setQueryData(
          ["chats"],
          (data: InfiniteData<PaginationResult<ChatPreview>, Pagination>) => {
            if (!data) return;

            const newChat: ChatPreview = {
              id: chat.id,
              isGroup: false,
              users: [user],
            };

            const [firstPage, ...restPages] = data.pages || [];

            return {
              ...data,
              pages: [
                {
                  ...firstPage,
                  data: [newChat, ...firstPage.data],
                },
                ...restPages,
              ].map((page) => ({ ...page, total: page.total + 1 })),
            };
          },
        );
      }

      return chatId;
    },
    mutationKey: ["findOrCreateChat", userId],
    onError: (error) => {
      console.error("findOrCreateChat error", error);
    },
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

  console.log("user", user);
  console.log("chat", chat);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: user?.fullName }} />
      {/* {isChatPending ? <ActivityIndicator /> : <Text>Chat {chat?.id}</Text>} */}
      <Chat isLoading={isChatPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
