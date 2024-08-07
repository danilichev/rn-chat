import { Database } from "src/types/database";
import { User } from "src/types/domain";

type DbUser = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "avatar_url" | "email" | "full_name" | "id"
>;

export const dbUserToUser = (dbUser: DbUser): User => ({
  avatarUrl: dbUser.avatar_url,
  email: dbUser.email,
  fullName: dbUser.full_name,
  id: dbUser.id,
});
