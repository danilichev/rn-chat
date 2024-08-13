import { getCurrentUserId, supabase } from "src/services/supabase";
import { Pagination, PaginationResult } from "src/types/common";
import { User } from "src/types/domain";
import { dbUserToUser } from "src/utils/mappers";

export const getUsers = async ({
  limit,
  offset = 0,
}: Pagination): Promise<PaginationResult<User>> => {
  const currentUserId = await getCurrentUserId();

  const { count, data, error } = await supabase
    .from("users")
    .select(`avatar_url, email, full_name, id`, { count: "exact" })
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
