import { SupabaseSession } from "src/services/supabase";

import { AuthSession } from "./types";

export const supabaseSessionToAuthSession = (
  session: SupabaseSession,
): AuthSession => ({
  accessToken: session.access_token,
  expiresAt: new Date(session.expires_at as number),
  refreshToken: session.refresh_token,
  tokenType: session.token_type,
  userId: session.user.id,
});
