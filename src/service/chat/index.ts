import { api } from "@/lib/api";
import type { MessageResponse } from "./types";

export async function sendMessage(message: string) {
  const response = await api.post<MessageResponse>("/search", { query: message });
  return response.data;
}