import { API1_URL } from "../../constants";
import { PaginatedPostsResponse } from "./types";

export async function getNews(
  page: number = 1
): Promise<PaginatedPostsResponse> {
  const url = new URL(`${API1_URL}/news`);
  url.searchParams.append("page", String(page));

  const response = await fetch(url.toString());
  return response.json();
}
