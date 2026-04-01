export type ChatSenderRole = "admin" | "user";

export interface ChatParticipant {
  id: string;
  name: string;
  role: ChatSenderRole;
  initial: string;
}

export interface ChatConversation {
  id: string;
  type: "group" | "direct";
  title: string;
  participants: ChatParticipant[];
  updatedAt: string;
  isDefaultGroup?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: ChatSenderRole;
  senderInitial: string;
  content: string;
  createdAt: string; // ISO string
  isOwn?: boolean;
}

export interface FetchConversationsParams {
  currentUserId: string;
}

export interface FetchConversationMessagesParams {
  conversationId: string;
  currentUserId: string;
}

export interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  content: string;
  senderName: string;
  senderRole: ChatSenderRole;
}

export interface OpenDirectConversationPayload {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: ChatSenderRole;
  targetUserId: string;
}
