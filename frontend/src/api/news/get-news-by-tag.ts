import { API1_URL } from "../../constants";
import { PaginatedPostsResponse } from "./types";

export async function getNewsByTag(
  tags: string[] = [],
  page: number = 1
): Promise<PaginatedPostsResponse> {
  const url = new URL(`${API1_URL}/news_by_tag`);
  
  url.searchParams.append("page", String(page));
  tags.forEach(tag => url.searchParams.append("tags", tag));

  const response = await fetch(url.toString());
  return response.json();
}