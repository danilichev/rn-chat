import { Button, Input } from "@rneui/themed";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { LinkButton } from "src/components/LinkButton";
import { supabase } from "src/infra/supabase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const signUpWithEmail = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!session) {
        Alert.alert("Please check your inbox for email verification!");
      }
    } catch (error) {
      console.log("signUpWithEmail:error", error);
      Alert.alert("Sign-up failure, please try again later");
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
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry
        value={password}
      />
      <Button
        containerStyle={styles.buttonContainer}
        disabled={isLoading}
        onPress={signUpWithEmail}
        title="Sign up"
      />
      <LinkButton
        containerStyle={styles.buttonContainer}
        href="/sign-in"
        title="Sign in"
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
