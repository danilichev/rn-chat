import { Avatar, ListItem } from "@rneui/themed";
import { useMemo } from "react";

import { User } from "src/types/domain";
import { stringToColor } from "src/utils/ui";

interface UserListItemProps {
  item: User;
}

export const UserListItem = ({ item: user }: UserListItemProps) => {
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
    <ListItem>
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
