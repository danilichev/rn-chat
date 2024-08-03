type User = {
  avatar: string;
  chatIds: string[];
  chats: Chat[];
  email: string; // should be unique
  fullName: string;
  id: string;
  isOnline: boolean;
};

type Message = {
  chatId: string;
  id: string;
  text: string;
  userId: string;
};

type Chat = {
  id: string;
  messageIds: string[];
  messages: Message[];
  title?: string;
  typing: string[];
  users: User[];
};
