import { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

import { getUsers } from "src/api/users";
import { ListFooter } from "src/components/ListFooter";
import { UserListItem } from "src/components/UserListItem";
import { useNotifyOnChangeProps } from "src/hooks/useNotifyOnChangeProps";
import { usePaginationQuery } from "src/hooks/usePaginationQuery";
import { User } from "src/types/domain";
import { keyExtractor } from "src/utils/common";

const USERS_PER_REQUEST = 20;

export default function StartChat() {
  const notifyOnChangeProps = useNotifyOnChangeProps();

  const { data, isFetching, loadMore } = usePaginationQuery<User>({
    notifyOnChangeProps,
    queryFn: getUsers,
    queryKey: ["users"],
    variables: { limit: USERS_PER_REQUEST },
  });

  const renderItem = useCallback<ListRenderItem<User>>(
    (props) => <UserListItem {...props} />,
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListFooterComponent={<ListFooter isLoading={true} />}
        data={data}
        initialNumToRender={USERS_PER_REQUEST}
        keyExtractor={keyExtractor}
        onEndReached={isFetching ? undefined : loadMore}
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
