import { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

import { getUsers } from "src/api/users";
import { UserListItem } from "src/components/UserListItem";
import { usePaginationQuery } from "src/hooks/usePaginationQuery";
import { User } from "src/types/domain";
import { keyExtractor } from "src/utils/common";

const USERS_PER_REQUEST = 8;

export default function StartChat() {
  const { data, hasMore, refetch } = usePaginationQuery<User>({
    queryFn: getUsers,
    queryKey: ["users"],
    variables: { limit: USERS_PER_REQUEST },
  });

  const onEndReached = useCallback(() => {
    if (hasMore) {
      refetch();
    }
  }, [hasMore, refetch]);

  const renderItem = useCallback<ListRenderItem<User>>(
    (props) => <UserListItem {...props} />,
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
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
