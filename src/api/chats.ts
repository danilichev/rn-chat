import { v4 as uuid } from "uuid";

import { getCurrentUserId, supabase } from "src/services/supabase";
import { Pagination, PaginationResult } from "src/types/common";
import { Chat, ChatPreview, User } from "src/types/domain";
import { dbChatToChat, dbUserToUser } from "src/utils/mappers";

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

interface GetChatParams {
  id: string;
}

export const getChat = async ({ id }: GetChatParams): Promise<Chat> => {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return dbChatToChat(data);
};

export const getChats = async ({
  limit,
  offset = 0,
}: Pagination): Promise<PaginationResult<ChatPreview>> => {
  const currentUserId = await getCurrentUserId();

  const { count, data, error } = await supabase
    .from("chat_users")
    .select(
      `
      chats(
        id,
        name,
        is_group,
        messages(
          id,
          text
        ),
        users(
          id,
          avatar_url,
          full_name
        )
      ),
      user_id
      `,
      { count: "exact" },
    )
    .eq("user_id", currentUserId as string)
    .filter("chats.users.id", "neq", currentUserId)
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data: data.reduce(
      (acc, { chats }) =>
        chats
          ? [
              ...acc,
              {
                ...dbChatToChat(chats),
                users: chats.users.map(dbUserToUser),
              } as Chat & { users: User[] },
            ]
          : acc,
      [] as ChatPreview[],
    ),
    limit,
    offset,
    total: count || 0,
  };
};
