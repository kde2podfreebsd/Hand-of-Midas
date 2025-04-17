import { API1_URL } from "../../constants";
import { NewsTags } from "./types";

export async function getTags(): Promise<NewsTags> {
  const response = await fetch(`${API1_URL}/tags`);
  return response.json();
}