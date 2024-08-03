import { Button, ButtonProps } from "@rneui/themed";
import { Link } from "expo-router";
import { ComponentProps, forwardRef } from "react";

// Fix issue with https://github.com/expo/router/discussions/632
const InnerButton = forwardRef(({ ...props }: ButtonProps, _) => {
  return <Button {...props} />;
});

InnerButton.displayName = "LinkButtonInnerButton";

type LinkButtonProps = Omit<ButtonProps, "onPress"> &
  ComponentProps<typeof Link>;

export const LinkButton = (props: LinkButtonProps) => (
  <Link {...props} asChild>
    <InnerButton {...props} />
  </Link>
);
