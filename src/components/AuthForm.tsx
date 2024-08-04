import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { LinkButton } from "src/components/LinkButton";
import { supabase } from "src/infra/supabase";

type AuthFormProps = {
  type: "sign-in" | "sign-up";
};

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const signInWithEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Sign in failure", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            email: email,
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!session) {
        Alert.alert("Please check your inbox for email verification!");
      }

      router.replace("/");
    } catch (error) {
      console.log("signUpWithEmail:error", error);
      Alert.alert("Sign-up failure, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {type === "sign-up" ? (
        <Input
          autoCapitalize="none"
          label="Full Name"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={setFullName}
          placeholder="John Doe"
          value={fullName}
        />
      ) : null}
      <Input
        autoCapitalize={"none"}
        label="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={setEmail}
        placeholder="email@address.com"
        value={email}
      />
      <Input
        autoCapitalize="none"
        label="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry
        value={password}
      />
      <Button
        containerStyle={styles.buttonContainer}
        disabled={isLoading}
        {...(type === "sign-in"
          ? { onPress: signInWithEmail, title: "Sign in" }
          : { onPress: signUpWithEmail, title: "Sign up" })}
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
