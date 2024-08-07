import { SupabaseSession } from "src/infra/supabase";
import { Database } from "src/types/database";
import { User, UserSession } from "src/types/domain";

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

export const supabaseSessionToUserSession = (
  session: SupabaseSession,
): UserSession => ({
  accessToken: session.access_token,
  expiresAt: new Date(session.expires_at as number),
  refreshToken: session.refresh_token,
  tokenType: session.token_type,
  userId: session.user.id,
});
