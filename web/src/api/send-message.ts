import { SERVER_URL } from '@/constants';

export async function sendMessage(id: string, message: string): Promise<{ response: string }> {
  const response = await fetch(`${SERVER_URL}/chat/message?wallet_id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error('Error during sending message');
  }

  return response.json();
}
