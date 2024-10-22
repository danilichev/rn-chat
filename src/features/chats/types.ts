import { User } from "src/features/users/types";

export interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
}

export interface ChatPreview extends Chat {
  users: User[];
}
