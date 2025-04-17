import { API1_URL } from "../../constants";

export type GetPoolsResponse = Array<{
  pool_name: string; // "WBTC/ETH";
  protocol: string; // "v2";
  fee: string; // "0.30%";
  tvl: string; // "9,2 млн $";
  apr: string; // "3,141%";
  vol_1d: string; // "263,7 тыс. $";
  vol_30d: string; // "7,8 млн $";
  vol_tvl_ratio: string; // "0,03";
}>;

export async function getPools(source = "*"): Promise<GetPoolsResponse> {
  const url = new URL(`${API1_URL}/pools`);

  url.searchParams.append("source", source);

  const response = await fetch(url.toString());

  return response.json();
}
