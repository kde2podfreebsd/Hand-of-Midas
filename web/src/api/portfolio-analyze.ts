import { SERVER_URL } from '@/constants';

export async function portfolioAnalyze(id: string): Promise<{ response: string }> {
  const response = await fetch(`${SERVER_URL}/portfolio/analyze?wallet_id=${id}`, {
    method: 'POST',
    signal: AbortSignal.timeout(300_000),
  });

  if (!response.ok) {
    throw new Error('Error during portfolioAnalyze');
  }

  return response.json();
}
