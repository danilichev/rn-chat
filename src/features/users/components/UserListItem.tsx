import { Avatar, ListItem, ListItemProps } from "@rneui/themed";
import { useMemo } from "react";
import { TouchableOpacity } from "react-native";

import { stringToColor } from "src/utils/ui";

import { User } from "../types";

interface UserListItemProps extends Pick<ListItemProps, "onPress"> {
  item: User;
}

export const UserListItem = ({ item: user, ...props }: UserListItemProps) => {
  const avatarBackgroundColor = useMemo(
    () => stringToColor(user.fullName),
    [user.fullName],
  );

  const avatarTitle = useMemo(
    () =>
      user.fullName
        .split(" ")
        .slice(0, 2)
        .map((i) => i[0].toUpperCase())
        .join(""),
    [user.fullName],
  );

  return (
    <ListItem Component={TouchableOpacity} bottomDivider {...props}>
      <Avatar
        containerStyle={{ backgroundColor: avatarBackgroundColor }}
        rounded
        title={avatarTitle}
      />
      <ListItem.Content>
        <ListItem.Title>{user.fullName}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};
