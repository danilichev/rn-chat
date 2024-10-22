export interface UserSession {
  accessToken: string;
  expiresAt?: Date;
  refreshToken?: string;
  tokenType: string;
  userId: string;
}
