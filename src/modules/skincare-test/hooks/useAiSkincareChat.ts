"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAiChatMutation, useSubmitQuizMutation } from "@/app/api/hooks/useQuizQueries";
import { useSkincareRoutineStore } from "@/app/api/hooks/useSkincareRoutineStore";
import { ExtractedProfile } from "@/app/api/endpoints/quiz.endpoint";

export type { ExtractedProfile } from "@/app/api/endpoints/quiz.endpoint";

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export const INITIAL_AI_MESSAGE: ChatMessage = {
  id: "ai-welcome",
  sender: "ai",
  text: "Hello! I'm your DayStar AI Aesthetician. ✨\n\nI'll help analyze your skin and build a customized DayStar skincare routine tailored specifically for you.\n\nTo get started, what is your skin type, or how does your skin feel throughout the day?",
  timestamp: "Just now",
  suggestions: ["Oily", "Dry", "Combination", "Normal", "Sensitive"],
};

const INITIAL_PROFILE: ExtractedProfile = {
  skinType: "",
  concerns: [],
  sensitivity: "",
  sunExposure: "",
  goals: [],
};

export function useAiSkincareChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [profile, setProfile] = useState<ExtractedProfile>(INITIAL_PROFILE);
  const [error, setError] = useState<string | null>(null);

  const profileRef = useRef<ExtractedProfile>(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const chatMutation = useAiChatMutation();
  const submitMutation = useSubmitQuizMutation();

  const isTyping = chatMutation.isPending;
  const isSubmitting = submitMutation.isPending;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping || isSubmitting) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setError(null);

    const conversationHistory = [...messages, userMessage].map((m) => ({
      role: (m.sender === "ai" ? "assistant" : "user") as "assistant" | "user",
      content: m.text,
    }));

    try {
      const response = await chatMutation.mutateAsync({
        messages: conversationHistory,
        currentProfile: profileRef.current,
      });

      if (response.extractedProfile) {
        setProfile((prev) => ({
          skinType: response.extractedProfile?.skinType || prev.skinType,
          concerns: response.extractedProfile?.concerns
            ? Array.from(new Set([...prev.concerns, ...response.extractedProfile.concerns]))
            : prev.concerns,
          sensitivity: response.extractedProfile?.sensitivity || prev.sensitivity,
          sunExposure: response.extractedProfile?.sunExposure || prev.sunExposure,
          goals: response.extractedProfile?.goals || prev.goals,
        }));
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.message || "Thank you for sharing! What are your main skin concerns?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: response.suggestions || [
          "Acne",
          "Pigmentation & Dark Spots",
          "Fine Lines & Aging",
          "Dryness",
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const isAbort = (err as Error)?.name === "AbortError";
      const message = isAbort
        ? "The server took too long to respond (it may be waking up from sleep). Please try sending your reply again!"
        : (err as Error)?.message || "Failed to communicate with AI assistant. Please try again.";
      setError(message);
    }
  };

  const handleCompleteAndAssemble = async () => {
    setError(null);

    const payload = {
      skinType: profile.skinType || "combination",
      concerns: profile.concerns.length > 0 ? profile.concerns : ["acne"],
      sensitivity: profile.sensitivity || "moderately_sensitive",
      sunExposure: profile.sunExposure || "moderate",
    };

    try {
      const routineData = await submitMutation.mutateAsync(payload);

      sessionStorage.setItem("skincare_results_routine", JSON.stringify(routineData));
      sessionStorage.setItem("skincare_results_answers", JSON.stringify(payload));
      useSkincareRoutineStore.getState().setRoutineData(routineData, payload);

      router.push("/skincare-test/results");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Could not generate routine. Please try again.");
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_AI_MESSAGE]);
    setProfile(INITIAL_PROFILE);
    setError(null);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    profile,
    isTyping,
    submitting: isSubmitting,
    error,
    canAssemble: Boolean(profile.skinType || profile.concerns.length > 0),
    chatContainerRef,
    handleSendMessage,
    handleCompleteAndAssemble,
    handleReset,
  };
}
