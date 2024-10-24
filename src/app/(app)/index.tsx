import { Button } from "@rneui/themed";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

import { ListFooter } from "src/components/ListFooter";
import { getChats } from "src/features/chats/api";
import { ChatPreviewListItem } from "src/features/chats/components/ChatPreviewListItem";
import { ChatPreview } from "src/features/chats/types";
import { useLoadMore } from "src/hooks/useLoadMore";
import { Pagination, PaginationResult } from "src/types/common";
import { keyExtractor } from "src/utils/common";

const startChatIcon = { color: "white", name: "edit-3", type: "feather" };

const CHATS_PER_REQUEST = 20;

export default function HomeScreen() {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    PaginationResult<ChatPreview>,
    Error,
    ChatPreview[],
    string[],
    Pagination
  >({
    queryFn: async ({ pageParam }) => {
      return await getChats(pageParam);
    },
    queryKey: ["chats"],
    initialPageParam: { limit: CHATS_PER_REQUEST, offset: 0 },
    getNextPageParam: (lastPage) => {
      const loadedDataSize = lastPage.data.length + (lastPage.offset || 0);
      return loadedDataSize < lastPage.total
        ? { limit: CHATS_PER_REQUEST, offset: loadedDataSize }
        : null;
    },
    select: (data) => data.pages.flatMap((page) => page.data),
    structuralSharing: false,
  });

  const loadMore = useLoadMore({ fetchNextPage, hasNextPage, isFetching });

  const makeOnPressListItemHandler = useCallback(
    (chatId: string) => () => {
      router.navigate({ pathname: "/chat", params: { chatId } });
    },
    [router],
  );

  const onPressStartChatButton = useCallback(() => {
    router.navigate("/start-chat");
  }, [router]);

  const renderItem = useCallback<ListRenderItem<ChatPreview>>(
    (props) => (
      <ChatPreviewListItem
        {...props}
        onPress={makeOnPressListItemHandler(props.item.id)}
      />
    ),
    [makeOnPressListItemHandler],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListFooterComponent={<ListFooter isLoading={isFetching} />}
        data={data}
        initialNumToRender={CHATS_PER_REQUEST}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.25}
        renderItem={renderItem}
      />
      <Button
        buttonStyle={styles.startChatButton}
        containerStyle={styles.startChatButtonContainer}
        icon={startChatIcon}
        iconContainerStyle={styles.startChatButtonIconContainer}
        onPress={onPressStartChatButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  startChatButton: {
    borderRadius: 28,
    height: 56,
    width: 56,
    backgroundColor: "#546E7A",
  },
  startChatButtonContainer: {
    bottom: 40,
    position: "absolute",
    right: 20,
  },
  startChatButtonIconContainer: {
    height: 20,
    width: 20,
  },
});
