import { getCurrentUserId, supabase } from "src/services/supabase";
import { Pagination, PaginationResult } from "src/types/common";
import { dbUserToUser } from "src/utils/mappers";

import { User } from "./types";

interface GetUserParams {
  id: string;
}

export const getUser = async ({ id }: GetUserParams): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("avatar_url, email, full_name, id")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data ? dbUserToUser(data) : null;
};

export const getUsers = async ({
  limit,
  offset = 0,
}: Pagination): Promise<PaginationResult<User>> => {
  const currentUserId = await getCurrentUserId();

  const { count, data, error } = await supabase
    .from("users")
    .select("avatar_url, email, full_name, id", { count: "exact" })
    .neq("id", currentUserId)
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data: data.map(dbUserToUser),
    limit,
    offset,
    total: count || 0,
  };
};
