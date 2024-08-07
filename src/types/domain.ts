export interface User {
  avatarUrl: string | null;
  email: string | null;
  fullName: string;
  id: string;
}

export interface UserSession {
  accessToken: string;
  expiresAt?: Date;
  refreshToken?: string;
  tokenType: string;
  userId: string;
}
