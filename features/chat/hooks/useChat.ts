import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import {
  DEFAULT_GROUP_ID,
  fetchChatUsers,
  fetchConversations,
  fetchMessagesByConversation,
  openDirectConversation,
  sendConversationMessage,
} from "@/features/chat/services/chatApi";
import type {
  ChatConversation,
  ChatMessage,
  ChatParticipant,
  OpenDirectConversationPayload,
  SendMessagePayload,
} from "@/features/chat/types";

interface UseChatConversationsOptions {
  currentUserId: string;
  enabled?: boolean;
}

interface UseChatMessagesOptions {
  conversationId: string;
  currentUserId: string;
  enabled?: boolean;
}

interface UseChatUsersOptions {
  currentUserId: string;
  enabled?: boolean;
}

export function useChatConversations({
  currentUserId,
  enabled = true,
}: UseChatConversationsOptions) {
  return useQuery<ChatConversation[], ApiError>({
    queryKey: [QUERY_KEYS.CHAT_CONVERSATIONS, currentUserId],
    queryFn: () => fetchConversations({ currentUserId }),
    enabled: enabled && !!currentUserId,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });
}

export function useChatMessages({
  conversationId,
  currentUserId,
  enabled = true,
}: UseChatMessagesOptions) {
  return useQuery<ChatMessage[], ApiError>({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES, conversationId, currentUserId],
    queryFn: () => fetchMessagesByConversation({ conversationId, currentUserId }),
    enabled: enabled && !!conversationId && !!currentUserId,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
}

export function useChatUsers({ currentUserId, enabled = true }: UseChatUsersOptions) {
  return useQuery<ChatParticipant[], ApiError>({
    queryKey: [QUERY_KEYS.CHAT_USERS, currentUserId],
    queryFn: () => fetchChatUsers(currentUserId),
    enabled: enabled && !!currentUserId,
    staleTime: 60_000,
  });
}

export function useOpenDirectConversation() {
  const queryClient = useQueryClient();

  return useMutation<ChatConversation, ApiError, OpenDirectConversationPayload>({
    mutationFn: openDirectConversation,
    onSuccess: (conversation, payload) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT_CONVERSATIONS, payload.currentUserId],
      });

      queryClient.setQueryData<ChatConversation[]>(
        [QUERY_KEYS.CHAT_CONVERSATIONS, payload.currentUserId],
        (old) => {
          if (!old) {
            return [conversation];
          }

          const withoutCurrent = old.filter((item) => item.id !== conversation.id);
          return [conversation, ...withoutCurrent];
        }
      );
    },
    onError: () => {
      toast.error("Không thể mở cuộc trò chuyện riêng. Vui lòng thử lại.");
    },
  });
}

export function useSendMessage(currentUserId: string) {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, ApiError, SendMessagePayload>({
    mutationFn: sendConversationMessage,
    onMutate: async (payload) => {
      const messageKey = [QUERY_KEYS.CHAT_MESSAGES, payload.conversationId, currentUserId] as const;
      const conversationKey = [QUERY_KEYS.CHAT_CONVERSATIONS, currentUserId] as const;

      await queryClient.cancelQueries({ queryKey: messageKey });

      const previousMessages = queryClient.getQueryData<ChatMessage[]>(messageKey);
      const previousConversations = queryClient.getQueryData<ChatConversation[]>(conversationKey);

      const optimistic: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        conversationId: payload.conversationId,
        senderId: payload.senderId,
        senderName: payload.senderName,
        senderRole: payload.senderRole,
        senderInitial:
          payload.senderName.charAt(payload.senderName.lastIndexOf(" ") + 1) ||
          payload.senderName.charAt(0),
        content: payload.content,
        createdAt: new Date().toISOString(),
        isOwn: true,
      };

      queryClient.setQueryData<ChatMessage[]>(messageKey, (old) =>
        old ? [...old, optimistic] : [optimistic]
      );

      queryClient.setQueryData<ChatConversation[]>(conversationKey, (old) => {
        if (!old) {
          return old;
        }

        const updated = old.map((item) =>
          item.id === payload.conversationId
            ? {
                ...item,
                updatedAt: optimistic.createdAt,
              }
            : item
        );

        return updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      return { previousMessages, previousConversations, messageKey, conversationKey };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as
        | {
            previousMessages?: ChatMessage[];
            previousConversations?: ChatConversation[];
            messageKey?: readonly [string, string, string];
            conversationKey?: readonly [string, string];
          }
        | undefined;

      if (ctx?.messageKey && ctx.previousMessages) {
        queryClient.setQueryData(ctx.messageKey, ctx.previousMessages);
      }

      if (ctx?.conversationKey && ctx.previousConversations) {
        queryClient.setQueryData(ctx.conversationKey, ctx.previousConversations);
      }

      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT_MESSAGES, variables.conversationId, currentUserId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT_CONVERSATIONS, currentUserId],
      });
    },
  });
}

// Compatibility helpers for legacy single-group chat paths.
export function useLegacyChatMessages(enabled: boolean, currentUserId: string) {
  return useChatMessages({
    conversationId: DEFAULT_GROUP_ID,
    currentUserId,
    enabled,
  });
}
