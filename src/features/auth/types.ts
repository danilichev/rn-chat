export interface AuthSession {
  accessToken: string;
  expiresAt?: Date;
  refreshToken?: string;
  tokenType: string;
  userId: string;
}
