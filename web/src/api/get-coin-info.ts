import indexedCoins from './helpers/indexed-coins-list.json';

export interface CoinInfo {
  image: {
    thumb: string;
  };
  market_data: {
    current_price: {
      btc: number;
      usd: number;
    };
  };
  detail_platforms: Record<
    string,
    {
      decimal_place: number | null;
    }
  >;
}

export async function getCoinInfo(symbol: string): Promise<CoinInfo> {
  const coin = (indexedCoins as Record<string, { id: string }>)[symbol.toLowerCase().trim()];
  if (!coin) {
    throw new Error('Coin not found');
  }

  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`);

  if (!response.ok) {
    throw new Error('Error during sending message');
  }

  return response.json();
}
