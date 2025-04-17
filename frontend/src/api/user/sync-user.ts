import { API1_URL, Protocols } from "../../constants";

export async function syncUser(
  blockchain: Protocols,
  address: string,
  userId: string
): Promise<void> {
  const url = new URL(`${API1_URL}/addresses/${userId}/add`);

  url.searchParams.append("blockchain", blockchain);
  url.searchParams.append("address", address);

  await fetch(url.toString(), { method: "POST" });
}
