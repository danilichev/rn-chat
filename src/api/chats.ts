import { v4 as uuid } from "uuid";

import { getCurrentUserId, supabase } from "src/services/supabase";
import { Chat } from "src/types/domain";
import { dbChatToChat } from "src/utils/mappers";

interface CreateOneToOneChatParams {
  userId: string;
}

export const createOneToOneChat = async ({
  userId,
}: CreateOneToOneChatParams): Promise<Chat> => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) throw new Error("User not logged in");

  const newChatId = uuid();

  const { data: newChat, error: insertChatError } = await supabase
    .from("chats")
    .insert({ id: newChatId, is_group: false })
    .select("*");

  if (insertChatError) throw insertChatError;

  const { error } = await supabase.from("chat_users").insert([
    { chat_id: newChatId, user_id: currentUserId },
    { chat_id: newChatId, user_id: userId },
  ]);

  if (error) {
    await supabase.from("chats").delete().eq("id", newChatId);

    throw new Error("Error creating one-to-one chat");
  }

  return dbChatToChat(newChat[0]);
};

interface GetOneToOneChatParams {
  userId: string;
}

export const findOneToOneChatId = async ({
  userId,
}: GetOneToOneChatParams): Promise<string | null> => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("one_to_one_chats")
    .select("*")
    .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) throw error;

  return data?.[0]?.chat_id ?? null;
};
