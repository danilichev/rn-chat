import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

import { ListFooter } from "src/components/ListFooter";
import { getUsers } from "src/features/users/api";
import { UserListItem } from "src/features/users/components/UserListItem";
import { User } from "src/features/users/types";
import { useLoadMore } from "src/hooks/useLoadMore";
import { useNotifyOnChangeProps } from "src/hooks/useNotifyOnChangeProps";
import { Pagination, PaginationResult } from "src/types/common";
import { keyExtractor } from "src/utils/common";

const USERS_PER_REQUEST = 20;

export default function StartChatScreen() {
  const router = useRouter();

  const notifyOnChangeProps = useNotifyOnChangeProps();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    PaginationResult<User>,
    Error,
    User[],
    string[],
    Pagination
  >({
    notifyOnChangeProps,
    queryFn: async ({ pageParam }) => {
      return await getUsers(pageParam);
    },
    queryKey: ["users"],
    initialPageParam: { limit: USERS_PER_REQUEST, offset: 0 },
    getNextPageParam: (lastPage) => {
      const loadedDataSize = lastPage.data.length + (lastPage.offset || 0);
      return loadedDataSize < lastPage.total
        ? { limit: USERS_PER_REQUEST, offset: loadedDataSize }
        : null;
    },
    select: (data) => data.pages.flatMap((page) => page.data),
  });

  console.log("data", JSON.stringify(data, null, 2));

  const loadMore = useLoadMore({ fetchNextPage, hasNextPage, isFetching });

  const makeOnPressListItemHandler = useCallback(
    (userId: string) => () => {
      router.navigate({ pathname: "/chat", params: { userId } });
    },
    [router],
  );

  const renderItem = useCallback<ListRenderItem<User>>(
    (props) => (
      <UserListItem
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
        initialNumToRender={USERS_PER_REQUEST}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.25}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
