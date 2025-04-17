import { API1_URL } from "../../constants";
import { SummaryResponse } from "./types";

export async function getSummaryByTag(
  tags: string[] = []
): Promise<SummaryResponse> {
  const url = new URL(`${API1_URL}/summary_by_tag`);

  tags.forEach((tag) => url.searchParams.append("tags", tag));

  const response = await fetch(url.toString());
  return response.json();
}
