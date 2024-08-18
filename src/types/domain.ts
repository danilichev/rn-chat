export interface User {
  avatarUrl?: string;
  email?: string;
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

export interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
}

export interface ChatPreview extends Chat {
  users: User[];
}
