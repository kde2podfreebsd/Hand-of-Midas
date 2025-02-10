import { SERVER_URL } from '@/constants';

export async function chatRegister(id: string) {
  const response = await fetch(`${SERVER_URL}/chat/register?wallet_id=${id}&seed_phrase=secured`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Error during sending message');
  }

  return response.text();
}
