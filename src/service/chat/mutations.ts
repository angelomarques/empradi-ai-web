import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { sendMessage } from ".";
import type { MessageResponse } from "./types";

export function useSendMessageMutation(options?:  Omit<UseMutationOptions<MessageResponse, Error, string, unknown>, "mutationFn">) {
  return useMutation({
    mutationFn: sendMessage,
    ...options,
  });
}