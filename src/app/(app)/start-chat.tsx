import { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";

import { getUsers } from "src/api/users";
import { UserListItem } from "src/components/UserListItem";
import { usePaginationQuery } from "src/hooks/usePaginationQuery";
import { User } from "src/types/domain";
import { keyExtractor } from "src/utils/common";

const USERS_PER_REQUEST = 15;

export default function StartChat() {
  const { data, loadMore } = usePaginationQuery<User>({
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
        data={data}
        initialNumToRender={USERS_PER_REQUEST}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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
