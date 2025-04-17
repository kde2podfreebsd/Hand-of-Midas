import { API1_URL } from "../../constants";
import { Transaction } from "./types";

export async function getTransactions(
  userId: string,
  page = 1
): Promise<Transaction[]> {
  void page;

  const url = new URL(`${API1_URL}/transactions`);
  url.searchParams.append("user_id", userId);

  const response = await fetch(url.toString());
  return response.json();
}
