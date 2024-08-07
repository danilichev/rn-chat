import { supabase } from "src/infra/supabase";

export interface SignInWithEmailParams {
  email: string;
  password: string;
}

export const signInWithEmail = async (
  params: SignInWithEmailParams,
): Promise<string> => {
  const { data, error } = await supabase.auth.signInWithPassword(params);

  if (error) throw error;

  if (!data?.user) throw new Error("User not found");

  return data.user.id;
};

export interface SignUpWithEmailParams {
  email: string;
  fullName: string;
  password: string;
}

export const signUpWithEmail = async (params: SignUpWithEmailParams) => {
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

  return data.user.id;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};
