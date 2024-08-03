import { Button, Input } from "@rneui/themed";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { LinkButton } from "src/components/LinkButton";
import { supabase } from "src/infra/supabase";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
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

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={"none"}
      />
      <Input
        autoCapitalize="none"
        label="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        value={password}
      />
      <Button
        containerStyle={styles.buttonContainer}
        disabled={isLoading}
        onPress={signInWithEmail}
        title="Sign in"
      />
      <LinkButton
        href="/sign-up"
        containerStyle={styles.buttonContainer}
        title="Sign up"
        type="clear"
      />
    </View>
  );
}

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
