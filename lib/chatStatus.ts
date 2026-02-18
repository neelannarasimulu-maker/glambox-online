export type ChatStatus = "available" | "unavailable";

type ConsultantChatInfo = {
  status: ChatStatus;
  responseTime: string;
};

const fallback: ConsultantChatInfo = {
  status: "unavailable",
  responseTime: "Replies next business day"
};

const chatStatusMap: Record<string, ConsultantChatInfo> = {
  "hair:amara": { status: "available", responseTime: "Usually replies in under 5 minutes" },
  "hair:noah": { status: "unavailable", responseTime: "Replies within 1 hour" },
  "hair:sienna": { status: "available", responseTime: "Usually replies in under 10 minutes" },
  "hair:kai": { status: "unavailable", responseTime: "Replies next business day" },
  "nails:mira": { status: "available", responseTime: "Usually replies in under 5 minutes" },
  "nails:hana": { status: "unavailable", responseTime: "Replies within 1 hour" },
  "nails:jules": { status: "available", responseTime: "Usually replies in under 10 minutes" },
  "nails:rhea": { status: "unavailable", responseTime: "Replies next business day" },
  "wellness:leila": { status: "available", responseTime: "Usually replies in under 5 minutes" },
  "wellness:dante": { status: "unavailable", responseTime: "Replies within 1 hour" },
  "wellness:yasmin": { status: "available", responseTime: "Usually replies in under 10 minutes" },
  "wellness:marco": { status: "unavailable", responseTime: "Replies next business day" }
};

export const getChatStatus = (popupKey: string, consultantId: string): ConsultantChatInfo =>
  chatStatusMap[`${popupKey}:${consultantId}`] ?? fallback;
