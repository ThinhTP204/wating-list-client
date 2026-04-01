export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: "admin" | "user";
  senderInitial: string;
  content: string;
  createdAt: string; // ISO string
  isOwn?: boolean;
}

export interface SendMessagePayload {
  content: string;
  senderName: string;
  senderRole: "admin" | "user";
}
