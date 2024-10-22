import { UserSession } from "src/features/auth/types";
import { Chat } from "src/features/chats/types";
import { User } from "src/features/users/types";
import { SupabaseSession } from "src/services/supabase";
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

type DbChat = Pick<
  Database["public"]["Tables"]["chats"]["Row"],
  "id" | "is_group" | "name"
>;

export const dbChatToChat = (dbChat: DbChat): Chat => ({
  id: dbChat.id,
  isGroup: dbChat.is_group,
  name: dbChat.name ?? undefined,
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
