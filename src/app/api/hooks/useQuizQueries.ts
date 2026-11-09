"use client";

import { useMutation } from "@tanstack/react-query";
import {
  sendAiChatMessage,
  submitQuizRoutine,
  AiChatRequest,
  SubmitQuizPayload,
} from "@/app/api/endpoints/quiz.endpoint";

export function useAiChatMutation() {
  return useMutation({
    mutationFn: (payload: AiChatRequest) => sendAiChatMessage(payload),
  });
}

export function useSubmitQuizMutation() {
  return useMutation({
    mutationFn: (payload: SubmitQuizPayload) => submitQuizRoutine(payload),
  });
}
