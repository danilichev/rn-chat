import { Chat } from "src/features/chats/types";
import { Database } from "src/types/database";

type DbChat = Pick<
  Database["public"]["Tables"]["chats"]["Row"],
  "id" | "is_group" | "name"
>;

export const dbChatToChat = (dbChat: DbChat): Chat => ({
  id: dbChat.id,
  isGroup: dbChat.is_group,
  name: dbChat.name ?? undefined,
});
