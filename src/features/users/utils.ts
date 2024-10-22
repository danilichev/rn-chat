import { User } from "src/features/users/types";
import { Database } from "src/types/database";

type DbUserFull = Database["public"]["Tables"]["users"]["Row"];

type DbUser = Pick<DbUserFull, "avatar_url" | "full_name" | "id"> &
  Partial<Pick<DbUserFull, "email">>;

export const dbUserToUser = (dbUser: DbUser): User => ({
  avatarUrl: dbUser.avatar_url ?? undefined,
  email: dbUser.email ?? undefined,
  fullName: dbUser.full_name,
  id: dbUser.id,
});
