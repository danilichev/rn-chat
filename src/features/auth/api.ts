import { supabase } from "src/services/supabase";

import { AuthSession } from "./types";
import { supabaseSessionToAuthSession } from "./utils";

export interface SignInWithEmailParams {
  email: string;
  password: string;
}

export const signInWithEmail = async (
  params: SignInWithEmailParams,
): Promise<AuthSession> => {
  const { data, error } = await supabase.auth.signInWithPassword(params);

  if (error) throw error;

  if (!data?.user) throw new Error("User not found");

  if (!data?.session) throw new Error("User is not authenticated");

  return supabaseSessionToAuthSession(data.session);
};

export interface SignUpWithEmailParams {
  email: string;
  fullName: string;
  password: string;
}

export const signUpWithEmail = async (
  params: SignUpWithEmailParams,
): Promise<AuthSession | null> => {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        email: params.email,
        full_name: params.fullName,
      },
    },
  });

  if (error) throw error;

  if (!data?.user) throw new Error("User not found");

  return data?.session ? supabaseSessionToAuthSession(data.session) : null;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};
