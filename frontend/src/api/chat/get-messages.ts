import { API1_URL } from "../../constants";
import { GetChatHistoryResponse } from "./types";

export async function getChatMessages(
  userId: string,
  page: number
): Promise<GetChatHistoryResponse> {
  const url = new URL(`${API1_URL}/chat/history`);

  url.searchParams.append("user_id", userId);
  url.searchParams.append("page", String(page));

  const response = await fetch(url.toString());
  return response.json();
}
