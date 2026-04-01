import apiService from "@/shared/lib/api/client";
import type {
  ChatConversation,
  ChatMessage,
  ChatParticipant,
  ChatSenderRole,
  FetchConversationMessagesParams,
  FetchConversationsParams,
  OpenDirectConversationPayload,
  SendMessagePayload,
} from "@/features/chat/types";

const DEFAULT_GROUP_ID = "conv-group-general";
const USE_CHAT_MOCK_ONLY = true;

function iso(offsetMinutes: number): string {
  return new Date(Date.now() - offsetMinutes * 60 * 1000).toISOString();
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  const words = trimmed.split(" ").filter(Boolean);
  if (words.length === 0) {
    return "U";
  }

  return (words[words.length - 1]?.charAt(0) || words[0]?.charAt(0) || "U").toUpperCase();
}

function createParticipant(id: string, name: string, role: ChatSenderRole): ChatParticipant {
  return {
    id,
    name,
    role,
    initial: getInitial(name),
  };
}

let mockUsers: ChatParticipant[] = [
  createParticipant("admin-01", "Nguyễn Văn Minh", "admin"),
  createParticipant("user-01", "Trần Thị Hoa", "user"),
  createParticipant("user-02", "Lê Quốc Bảo", "user"),
  createParticipant("user-03", "Phạm Thị Lan", "user"),
  createParticipant("user-04", "Hoàng Đức Thắng", "user"),
  createParticipant("user-05", "Vũ Thị Mai", "user"),
  createParticipant("user-06", "Đặng Văn Hùng", "user"),
  createParticipant("emp-01", "Nguyễn Văn An", "user"),
  createParticipant("emp-02", "Trần Thị Bình", "user"),
  createParticipant("emp-03", "Lê Văn Cường", "user"),
  createParticipant("emp-04", "Phạm Thị Dung", "user"),
  createParticipant("emp-05", "Hoàng Văn Em", "user"),
  createParticipant("emp-06", "Vũ Thị Phương", "user"),
  createParticipant("emp-07", "Đặng Văn Giang", "user"),
  createParticipant("emp-08", "Bùi Thị Hoa", "user"),
  createParticipant("emp-09", "Ngô Văn Inh", "user"),
  createParticipant("emp-10", "Đinh Thị Kim", "user"),
  createParticipant("emp-11", "Trương Văn Khánh", "user"),
  createParticipant("emp-12", "Lý Thị Thảo", "user"),
];

let mockConversations: ChatConversation[] = [
  {
    id: DEFAULT_GROUP_ID,
    type: "group",
    title: "Nhóm chung",
    participants: [...mockUsers],
    updatedAt: new Date().toISOString(),
    isDefaultGroup: true,
  },
];

let mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "admin-01",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Chào cả nhóm! Nhớ điền báo cáo chấm công trước 17h hôm nay nhé.",
    createdAt: iso(1440 + 90),
  },
  {
    id: "msg-2",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "user-01",
    senderName: "Trần Thị Hoa",
    senderRole: "user",
    senderInitial: "H",
    content: "Vâng anh ạ, em sẽ gửi trước 16h30.",
    createdAt: iso(1440 + 80),
  },
  {
    id: "msg-3",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "user-02",
    senderName: "Lê Quốc Bảo",
    senderRole: "user",
    senderInitial: "B",
    content: "Anh ơi, ca chiều thứ 6 tuần sau có ai trống không? Em cần đổi ca gấp.",
    createdAt: iso(1440 + 60),
  },
  {
    id: "msg-4",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "admin-01",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Bạn nào rảnh ca chiều thứ 6 (14:00-22:00) liên hệ Bảo nhé.",
    createdAt: iso(1440 + 55),
  },
  {
    id: "msg-5",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "user-03",
    senderName: "Phạm Thị Lan",
    senderRole: "user",
    senderInitial: "L",
    content: "Em có thể nhận ca đó cho Bảo. Em sẽ nhắn riêng nhé.",
    createdAt: iso(1440 + 45),
  },
  {
    id: "msg-6",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "user-06",
    senderName: "Đặng Văn Hùng",
    senderRole: "user",
    senderInitial: "H",
    content: "Cả team nhớ check lịch tháng mới trước cuối ngày nhé.",
    createdAt: iso(120),
  },
  {
    id: "msg-7",
    conversationId: DEFAULT_GROUP_ID,
    senderId: "admin-01",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Cảm ơn mọi người. Có gì cần hỗ trợ cứ nhắn trong nhóm hoặc nhắn riêng.",
    createdAt: iso(30),
  },
];

function sortByUpdatedDesc(conversations: ChatConversation[]): ChatConversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function directConversationId(userA: string, userB: string): string {
  const [a, b] = [userA, userB].sort();
  return `conv-direct-${a}-${b}`;
}

function ensureParticipant(id: string, name: string, role: ChatSenderRole): ChatParticipant {
  const existing = mockUsers.find((item) => item.id === id);
  if (existing) {
    return existing;
  }

  const participant = createParticipant(id, name, role);
  mockUsers = [...mockUsers, participant];
  return participant;
}

function ensureDefaultGroupContains(user: ChatParticipant): void {
  const group = mockConversations.find((item) => item.id === DEFAULT_GROUP_ID);
  if (!group) {
    return;
  }

  if (!group.participants.some((item) => item.id === user.id)) {
    group.participants = [...group.participants, user];
  }
}

function getLastMessageTime(conversationId: string): string {
  const last = mockMessages
    .filter((item) => item.conversationId === conversationId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return last?.createdAt ?? new Date().toISOString();
}

function getOrCreateDirectConversationByUsers(
  currentUser: ChatParticipant,
  targetUser: ChatParticipant
): ChatConversation {
  const id = directConversationId(currentUser.id, targetUser.id);
  const existing = mockConversations.find((item) => item.id === id);
  if (existing) {
    return existing;
  }

  const conversation: ChatConversation = {
    id,
    type: "direct",
    title: targetUser.name,
    participants: [currentUser, targetUser],
    updatedAt: new Date().toISOString(),
  };

  mockConversations = [...mockConversations, conversation];
  return conversation;
}

function withIsOwn(message: ChatMessage, currentUserId: string): ChatMessage {
  return {
    ...message,
    isOwn: message.senderId === currentUserId,
  };
}

export async function fetchChatUsers(currentUserId: string): Promise<ChatParticipant[]> {
  if (USE_CHAT_MOCK_ONLY) {
    return mockUsers.filter((item) => item.id !== currentUserId);
  }

  try {
    const response = await apiService.request<{ data: ChatParticipant[] }>({
      method: "GET",
      url: "/api/v1/chat/users",
    });

    return response.data.data.filter((item) => item.id !== currentUserId);
  } catch {
    return mockUsers.filter((item) => item.id !== currentUserId);
  }
}

export async function fetchConversations({
  currentUserId,
}: FetchConversationsParams): Promise<ChatConversation[]> {
  if (USE_CHAT_MOCK_ONLY) {
    const user = ensureParticipant(currentUserId, "Người dùng", "user");
    ensureDefaultGroupContains(user);

    const scoped = mockConversations
      .filter((conversation) =>
        conversation.participants.some((participant) => participant.id === currentUserId)
      )
      .map((conversation) => ({
        ...conversation,
        title:
          conversation.type === "direct"
            ? conversation.participants.find((participant) => participant.id !== currentUserId)?.name ??
              "Nhắn tin riêng"
            : conversation.title,
        updatedAt: getLastMessageTime(conversation.id),
      }));

    return sortByUpdatedDesc(scoped);
  }

  try {
    const response = await apiService.request<{ data: ChatConversation[] }>({
      method: "GET",
      url: "/api/v1/chat/conversations",
      params: { userId: currentUserId },
    });

    return sortByUpdatedDesc(response.data.data);
  } catch {
    const user = ensureParticipant(currentUserId, "Người dùng", "user");
    ensureDefaultGroupContains(user);

    const scoped = mockConversations
      .filter((conversation) =>
        conversation.participants.some((participant) => participant.id === currentUserId)
      )
      .map((conversation) => ({
        ...conversation,
        title:
          conversation.type === "direct"
            ? conversation.participants.find((participant) => participant.id !== currentUserId)?.name ??
              "Nhắn tin riêng"
            : conversation.title,
        updatedAt: getLastMessageTime(conversation.id),
      }));

    return sortByUpdatedDesc(scoped);
  }
}

export async function openDirectConversation({
  currentUserId,
  currentUserName,
  currentUserRole,
  targetUserId,
}: OpenDirectConversationPayload): Promise<ChatConversation> {
  if (USE_CHAT_MOCK_ONLY) {
    const currentUser = ensureParticipant(currentUserId, currentUserName, currentUserRole);
    ensureDefaultGroupContains(currentUser);

    const targetUser =
      mockUsers.find((item) => item.id === targetUserId) ??
      ensureParticipant(targetUserId, `User ${targetUserId}`, "user");

    const conversation = getOrCreateDirectConversationByUsers(currentUser, targetUser);
    return {
      ...conversation,
      title: targetUser.name,
      updatedAt: getLastMessageTime(conversation.id),
    };
  }

  try {
    const response = await apiService.request<{ data: ChatConversation }>({
      method: "POST",
      url: "/api/v1/chat/conversations/direct",
      data: {
        currentUserId,
        targetUserId,
      },
    });

    return response.data.data;
  } catch {
    const currentUser = ensureParticipant(currentUserId, currentUserName, currentUserRole);
    ensureDefaultGroupContains(currentUser);

    const targetUser =
      mockUsers.find((item) => item.id === targetUserId) ??
      ensureParticipant(targetUserId, `User ${targetUserId}`, "user");

    const conversation = getOrCreateDirectConversationByUsers(currentUser, targetUser);
    return {
      ...conversation,
      title: targetUser.name,
      updatedAt: getLastMessageTime(conversation.id),
    };
  }
}

export async function fetchMessagesByConversation({
  conversationId,
  currentUserId,
}: FetchConversationMessagesParams): Promise<ChatMessage[]> {
  if (USE_CHAT_MOCK_ONLY) {
    return mockMessages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((message) => withIsOwn(message, currentUserId));
  }

  try {
    const response = await apiService.request<{ data: ChatMessage[] }>({
      method: "GET",
      url: "/api/v1/chat/messages",
      params: { conversationId },
    });

    return response.data.data.map((message) => withIsOwn(message, currentUserId));
  } catch {
    return mockMessages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((message) => withIsOwn(message, currentUserId));
  }
}

export async function sendConversationMessage(payload: SendMessagePayload): Promise<ChatMessage> {
  const optimisticMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    conversationId: payload.conversationId,
    senderId: payload.senderId,
    senderName: payload.senderName,
    senderRole: payload.senderRole,
    senderInitial: getInitial(payload.senderName),
    content: payload.content,
    createdAt: new Date().toISOString(),
    isOwn: true,
  };

  if (USE_CHAT_MOCK_ONLY) {
    mockMessages = [...mockMessages, optimisticMessage];

    mockConversations = mockConversations.map((conversation) =>
      conversation.id === payload.conversationId
        ? {
            ...conversation,
            updatedAt: optimisticMessage.createdAt,
          }
        : conversation
    );

    return optimisticMessage;
  }

  try {
    const response = await apiService.request<{ data: ChatMessage }>({
      method: "POST",
      url: "/api/v1/chat/messages",
      data: payload,
    });

    const created = { ...response.data.data, isOwn: true };
    mockMessages = [...mockMessages, created];
    return created;
  } catch {
    mockMessages = [...mockMessages, optimisticMessage];

    mockConversations = mockConversations.map((conversation) =>
      conversation.id === payload.conversationId
        ? {
            ...conversation,
            updatedAt: optimisticMessage.createdAt,
          }
        : conversation
    );

    return optimisticMessage;
  }
}

export { DEFAULT_GROUP_ID };
