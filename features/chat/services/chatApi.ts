import apiService from "@/shared/lib/api/client";
import type { ChatMessage, SendMessagePayload } from "@/features/chat/types";

// ── Mock data ──────────────────────────────────────────────────────────────

function iso(offsetMinutes: number): string {
  return new Date(Date.now() - offsetMinutes * 60 * 1000).toISOString();
}

let mockMessages: ChatMessage[] = [
  {
    id: "msg-1",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Chào cả nhóm! Nhớ điền báo cáo chấm công trước 17h hôm nay nhé.",
    createdAt: iso(1440 + 90), // yesterday
  },
  {
    id: "msg-2",
    senderName: "Trần Thị Hoa",
    senderRole: "user",
    senderInitial: "H",
    content: "Vâng anh ạ, em sẽ gửi trước 16h30.",
    createdAt: iso(1440 + 80),
  },
  {
    id: "msg-3",
    senderName: "Lê Quốc Bảo",
    senderRole: "user",
    senderInitial: "B",
    content: "Anh ơi, ca chiều thứ 6 tuần sau có ai trống không? Em cần đổi ca gấp.",
    createdAt: iso(1440 + 60),
  },
  {
    id: "msg-4",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Bạn nào rảnh ca chiều thứ 6 (14:00–22:00) liên hệ Bảo nhé, điểm karma sẽ được cộng thêm.",
    createdAt: iso(1440 + 55),
  },
  {
    id: "msg-5",
    senderName: "Phạm Thị Lan",
    senderRole: "user",
    senderInitial: "L",
    content: "Em có thể nhận ca đó cho Bảo. Em sẽ nhắn riêng nhé.",
    createdAt: iso(1440 + 45),
  },
  {
    id: "msg-6",
    senderName: "Hoàng Đức Thắng",
    senderRole: "user",
    senderInitial: "T",
    content: "Anh Minh ơi, lịch họp tháng 4 đã cập nhật chưa ạ? Em chưa thấy trên hệ thống.",
    createdAt: iso(1440 + 30),
  },
  {
    id: "msg-7",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Đã cập nhật rồi nhé Thắng, họp vào 9h sáng thứ 2 tuần tới tại phòng họp tầng 3.",
    createdAt: iso(1440 + 20),
  },
  {
    id: "msg-8",
    senderName: "Vũ Thị Mai",
    senderRole: "user",
    senderInitial: "M",
    content: "Cảm ơn anh! Nhớ chuẩn bị báo cáo KPI tháng 3 để trình bày trong buổi họp nhé mọi người.",
    createdAt: iso(1440 + 10),
  },
  {
    id: "msg-9",
    senderName: "Đặng Văn Hùng",
    senderRole: "user",
    senderInitial: "H",
    content: "Chị Mai ơi, form báo cáo KPI gửi qua email hay nộp trực tiếp ạ?",
    createdAt: iso(200),
  },
  {
    id: "msg-10",
    senderName: "Vũ Thị Mai",
    senderRole: "user",
    senderInitial: "M",
    content: "Gửi qua email cho anh Minh trước 8h thứ 2 nhé anh Hùng.",
    createdAt: iso(190),
  },
  {
    id: "msg-11",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Nhắc nhở: Tháng này có đợt kiểm tra đồng phục, mọi người mặc đúng quy định nhé!",
    createdAt: iso(120),
  },
  {
    id: "msg-12",
    senderName: "Trần Thị Hoa",
    senderRole: "user",
    senderInitial: "H",
    content: "Dạ, cảm ơn anh đã nhắc. Chúc cả nhóm một ngày làm việc vui vẻ!",
    createdAt: iso(60),
  },
  {
    id: "msg-13",
    senderName: "Lê Quốc Bảo",
    senderRole: "user",
    senderInitial: "B",
    content: "Cảm ơn chị Lan đã đổi ca giúp em. Em sẽ nhớ ơn! 🙏",
    createdAt: iso(45),
  },
  {
    id: "msg-14",
    senderName: "Phạm Thị Lan",
    senderRole: "user",
    senderInitial: "L",
    content: "Không có chi Bảo, đồng nghiệp giúp nhau là chuyện bình thường mà.",
    createdAt: iso(30),
  },
  {
    id: "msg-15",
    senderName: "Nguyễn Văn Minh",
    senderRole: "admin",
    senderInitial: "M",
    content: "Tốt lắm nhóm mình! Tinh thần đoàn kết là sức mạnh của chúng ta. Làm việc vui vẻ nhé!",
    createdAt: iso(5),
  },
];

// ── Service functions ──────────────────────────────────────────────────────

export async function fetchMessages(): Promise<ChatMessage[]> {
  try {
    const response = await apiService.request<{ data: ChatMessage[] }>({
      method: "GET",
      url: "/api/v1/chat/messages",
    });
    return response.data.data;
  } catch {
    return [...mockMessages];
  }
}

export async function sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderName: payload.senderName,
    senderRole: payload.senderRole,
    senderInitial: payload.senderName.charAt(payload.senderName.lastIndexOf(" ") + 1) || payload.senderName.charAt(0),
    content: payload.content,
    createdAt: new Date().toISOString(),
    isOwn: true,
  };

  try {
    const response = await apiService.request<{ data: ChatMessage }>({
      method: "POST",
      url: "/api/v1/chat/messages",
      data: payload,
    });
    const created = response.data.data;
    mockMessages = [...mockMessages, { ...created, isOwn: true }];
    return { ...created, isOwn: true };
  } catch {
    mockMessages = [...mockMessages, newMessage];
    return newMessage;
  }
}
