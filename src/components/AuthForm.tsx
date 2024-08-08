import { Button, Input } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { signInWithEmail, signUpWithEmail } from "src/api/auth";
import { LinkButton } from "src/components/LinkButton";

type AuthFormProps = {
  type: "sign-in" | "sign-up";
};

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const {
    isPending: isSignInWithEmailPending,
    mutateAsync: signInWithEmailAsync,
  } = useMutation({
    mutationFn: signInWithEmail,
    onError: (error) => Alert.alert("Sign in failure", error.message),
    onSuccess: () => router.replace("/"),
  });

  const {
    isPending: isSignUpWithEmailPending,
    mutateAsync: signUpWithEmailAsync,
  } = useMutation({
    mutationFn: signUpWithEmail,
    onError: () => Alert.alert("Sign-up failure, please try again later"),
    onSuccess: (data) => {
      if (data) {
        Alert.alert("Please check your inbox for email verification!");
      }

      router.replace("/");
    },
  });

  const onPressSignInWithEmail = async () => {
    await signInWithEmailAsync({ email, password });
  };

  const onPressSignUpWithEmail = async () => {
    await signUpWithEmailAsync({ email, fullName, password });
  };

  return (
    <View style={styles.container}>
      {type === "sign-up" ? (
        <Input
          autoCapitalize="none"
          label="Full Name"
          leftIcon={{ type: "feather", name: "user" }}
          onChangeText={setFullName}
          placeholder="John Doe"
          value={fullName}
        />
      ) : null}
      <Input
        autoCapitalize={"none"}
        label="Email"
        leftIcon={{ type: "feather", name: "mail" }}
        onChangeText={setEmail}
        placeholder="email@address.com"
        value={email}
      />
      <Input
        autoCapitalize="none"
        label="Password"
        leftIcon={{ type: "feather", name: "lock" }}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        value={password}
      />
      <Button
        containerStyle={styles.buttonContainer}
        disabled={isSignInWithEmailPending || isSignUpWithEmailPending}
        {...(type === "sign-in"
          ? { onPress: onPressSignInWithEmail, title: "Sign in" }
          : { onPress: onPressSignUpWithEmail, title: "Sign up" })}
      />
      <LinkButton
        containerStyle={styles.buttonContainer}
        type="clear"
        {...(type === "sign-in"
          ? { href: "/sign-up", title: "Sign up" }
          : { href: "/sign-in", title: "Sign in" })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
