import { supabase } from "src/infra/supabase";
import { User } from "src/types/domain";
import { dbUserToUser } from "src/utils/mappers";

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select(`avatar_url, email, full_name, id`);

  if (error) throw error;

  return data.map((i) => dbUserToUser(i));
};
