import { API1_URL } from "../../constants";
import { Message, SendMessageResponse } from "./types";

export async function sendMessage(
  userId: string,
  message: string
): Promise<Message> {
  const url = new URL(`${API1_URL}/chat/send_message`);

  url.searchParams.append("user_id", userId);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });
  const data = (await response.json()) as SendMessageResponse;

  return {
    role: "assistant",
    content: data.response,
    timestamp: data.timestamp,
  };
}
