'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { ENDPOINTS } from '@/app/api/constants/endpoints';
import { apiClient } from '@/app/api/utils/client';
import { useSkincareRoutineStore } from '@/app/api/hooks/useSkincareRoutineStore';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface ExtractedProfile {
  skinType: string;
  concerns: string[];
  sensitivity: string;
  sunExposure: string;
  goals: string[];
}

const INITIAL_AI_MESSAGE: ChatMessage = {
  id: 'ai-welcome',
  sender: 'ai',
  text: "Hello! I'm your DayStar AI Aesthetician. ✨\n\nI'll help analyze your skin and build a customized DayStar skincare routine tailored specifically for you.\n\nTo get started, what is your skin type, or how does your skin feel throughout the day?",
  timestamp: 'Just now',
  suggestions: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'],
};

export function AiSkincareChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extracted skin profile attributes
  const [profile, setProfile] = useState<ExtractedProfile>({
    skinType: '',
    concerns: [],
    sensitivity: '',
    sunExposure: '',
    goals: []
  });
  // Keep a ref in sync so handleSendMessage always reads the latest profile
  const profileRef = useRef<ExtractedProfile>(profile);
  useEffect(() => { profileRef.current = profile; }, [profile]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Submit user message and request AI response
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping || submitting) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      // Build conversation payload for backend endpoint
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
      console.log("conversationHistory", conversationHistory);
      console.log("profileRef", profileRef.current);
      // Send to backend API with generous timeout for AI round-trip (e.g., Render cold starts)
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout for Render cold start

      const rawRes = await fetch(`${BASE_URL}${ENDPOINTS.QUIZ.CHAT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          currentProfile: profileRef.current
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!rawRes.ok) {
        const errBody = await rawRes.text();
        throw new Error(errBody || `Server error ${rawRes.status}`);
      }

      const response: {
        message: string;
        extractedProfile?: Partial<ExtractedProfile>;
        suggestions?: string[];
        isComplete?: boolean;
      } = await rawRes.json();
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
        sender: 'ai',
        text: response.message || "Thank you for sharing! What are your main skin concerns?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions || [
          "Acne",
          "Pigmentation & Dark Spots",
          "Fine Lines & Aging",
          "Dryness"
        ]
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      console.error("Backend AI endpoint error:", err);
      const isAbort = (err as Error)?.name === 'AbortError';
      const errorMessage = isAbort
        ? "The server took too long to respond (it may be waking up from sleep). Please try sending your reply again!"
        : ((err as { message?: string })?.message || "Failed to communicate with AI assistant. Please try again.");
      setError(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  // Submit complete profile to backend routine assembler
  const handleCompleteAndAssemble = async () => {
    setSubmitting(true);
    setError(null);

    const finalSkinType = profile.skinType || 'combination';
    const finalConcerns = profile.concerns.length > 0 ? profile.concerns : ['acne'];
    const finalSensitivity = profile.sensitivity || 'moderately_sensitive';
    const finalSunExposure = profile.sunExposure || 'moderate';

    try {
      const routineData = await apiClient.request<Record<string, unknown>>(ENDPOINTS.QUIZ.SUBMIT, undefined, {
        method: 'POST',
        body: JSON.stringify({
          skinType: finalSkinType,
          concerns: finalConcerns,
          sensitivity: finalSensitivity,
          sunExposure: finalSunExposure,
        }),
      });

      sessionStorage.setItem('skincare_results_routine', JSON.stringify(routineData));
      const answersPayload = {
        skinType: finalSkinType,
        concerns: finalConcerns,
        sensitivity: finalSensitivity,
        sunExposure: finalSunExposure,
      };
      sessionStorage.setItem('skincare_results_answers', JSON.stringify(answersPayload));
      useSkincareRoutineStore.getState().setRoutineData(routineData, answersPayload);

      router.push('/skincare-test/results');
    } catch (err: unknown) {
      console.error('Failed to submit AI quiz routine:', err);
      const errorMessage = (err as { message?: string })?.message || 'Could not generate routine. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_AI_MESSAGE]);
    setProfile({
      skinType: '',
      concerns: [],
      sensitivity: '',
      sunExposure: '',
      goals: []
    });
    setError(null);
  };

  const canAssemble = Boolean(profile.skinType || profile.concerns.length > 0);

  return (
    <div className="w-full flex flex-col bg-[#FDF9F8] border border-[#78534a]/15 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Header bar */}
      <div className="bg-[#004956] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold tracking-wide">Groq AI Aesthetician</h3>
              <span className="bg-amber-400/20 text-amber-200 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border border-amber-300/30">
                Live AI
              </span>
            </div>
            <p className="text-xs text-white/75 font-light">Conversational Skin Diagnosis</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Live Detected Profile Summary Banner */}
      <div className="bg-[#FAF5F3] px-6 py-3 border-b border-[#78534a]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#78534a]">
          <span className="font-semibold">Detected Profile:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${profile.skinType ? "bg-[#004956] text-white border-[#004956]" : "bg-stone-100 text-stone-400 border-stone-200"
            }`}>
            Skin: {profile.skinType ? profile.skinType.toUpperCase() : 'Analyzing...'}
          </span>

          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${profile.concerns.length > 0 ? "bg-[#78534a] text-white border-[#78534a]" : "bg-stone-100 text-stone-400 border-stone-200"
            }`}>
            Concerns: {profile.concerns.length > 0 ? profile.concerns.join(', ') : 'Identifying...'}
          </span>

          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${profile.sensitivity ? "bg-amber-800 text-white border-amber-800" : "bg-stone-100 text-stone-400 border-stone-200"
            }`}>
            Sensitivity: {profile.sensitivity ? profile.sensitivity.replace('_', ' ') : 'Pending'}
          </span>

          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${profile.sunExposure ? "bg-[#c47c5d] text-white border-[#c47c5d]" : "bg-stone-100 text-stone-400 border-stone-200"
            }`}>
            Sun: {profile.sunExposure ? profile.sunExposure.toUpperCase() : 'Pending'}
          </span>
        </div>

        {canAssemble && (
          <button
            onClick={handleCompleteAndAssemble}
            disabled={submitting}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#004956] text-white hover:bg-[#004956]/90 font-medium transition-all shadow-xs cursor-pointer text-xs"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Assemble Routine Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Messages Stream Container */}
      <div
        ref={chatContainerRef}
        className="p-6 h-[420px] overflow-y-auto space-y-4 bg-[#FDF9F8]/60 scrollbar-thin scrollbar-thumb-stone-300"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs ${msg.sender === 'user' ? 'bg-[#78534a]' : 'bg-[#004956]'
                }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${msg.sender === 'user'
                ? 'bg-[#78534a] text-white rounded-tr-none'
                : 'bg-white text-[#4A4543] border border-[#78534a]/15 rounded-tl-none'
                }`}>
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-stone-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && msg.id === messages[messages.length - 1]?.id && (
              <div className="ml-10 mt-3 flex flex-wrap gap-2">
                {msg.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (suggestion.includes("Generate My Routine")) {
                        handleCompleteAndAssemble();
                      } else {
                        handleSendMessage(suggestion);
                      }
                    }}
                    disabled={isTyping || submitting}
                    className="px-3 py-1.5 text-xs rounded-full border border-[#004956]/30 bg-white text-[#004956] hover:bg-[#004956] hover:text-white transition-all shadow-xs cursor-pointer font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2.5 text-stone-400 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#004956] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#004956] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#004956] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#004956] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input controls & Submit trigger */}
      <div className="p-4 bg-white border-t border-[#78534a]/10 flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your reply to Groq AI (e.g. My skin gets oily around noon...)"
            disabled={isTyping || submitting}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-[#004956] focus:ring-1 focus:ring-[#004956] outline-none text-sm text-[#4A4543] placeholder:text-stone-400 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping || submitting}
            className="p-3 rounded-xl bg-[#004956] hover:bg-[#004956]/90 disabled:bg-stone-200 text-white disabled:text-stone-400 transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
          <span>Powered by Groq AI Aesthetician</span>
          {canAssemble && (
            <button
              onClick={handleCompleteAndAssemble}
              disabled={submitting}
              className="text-[#78534a] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ready? Complete & See Routine</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
