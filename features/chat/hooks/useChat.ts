import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { ApiError } from "@/shared/lib/api/client";
import { fetchMessages, sendMessage } from "@/features/chat/services/chatApi";
import type { ChatMessage, SendMessagePayload } from "@/features/chat/types";

// ── Query hook ─────────────────────────────────────────────────────────────

interface UseChatMessagesOptions {
  enabled: boolean;
}

export function useChatMessages({ enabled }: UseChatMessagesOptions) {
  return useQuery<ChatMessage[], ApiError>({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES],
    queryFn: fetchMessages,
    enabled,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
}

// ── Mutation hook ──────────────────────────────────────────────────────────

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, ApiError, SendMessagePayload>({
    mutationFn: sendMessage,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.CHAT_MESSAGES] });

      const previous = queryClient.getQueryData<ChatMessage[]>([QUERY_KEYS.CHAT_MESSAGES]);

      const optimistic: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        senderName: payload.senderName,
        senderRole: payload.senderRole,
        senderInitial:
          payload.senderName.charAt(payload.senderName.lastIndexOf(" ") + 1) ||
          payload.senderName.charAt(0),
        content: payload.content,
        createdAt: new Date().toISOString(),
        isOwn: true,
      };

      queryClient.setQueryData<ChatMessage[]>([QUERY_KEYS.CHAT_MESSAGES], (old) =>
        old ? [...old, optimistic] : [optimistic]
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as { previous?: ChatMessage[] } | undefined;
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData([QUERY_KEYS.CHAT_MESSAGES], ctx.previous);
      }
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_MESSAGES] });
    },
  });
}
