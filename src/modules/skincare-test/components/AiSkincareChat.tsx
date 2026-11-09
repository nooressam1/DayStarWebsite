'use client';

import React from 'react';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAiSkincareChat } from '../hooks/useAiSkincareChat';

export type { ChatMessage, ExtractedProfile } from '../hooks/useAiSkincareChat';

export function AiSkincareChat() {
  const {
    messages,
    inputValue,
    setInputValue,
    profile,
    isTyping,
    submitting,
    error,
    canAssemble,
    chatContainerRef,
    handleSendMessage,
    handleCompleteAndAssemble,
    handleReset,
  } = useAiSkincareChat();

  return (
    <div className="w-full flex flex-col bg-[#FDF9F8] border border-[#78534a]/15 rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Header bar */}
      <div className="bg-[#004956] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide truncate">AI Aesthetician</h3>

            </div>
            <p className="text-[11px] sm:text-xs text-white/75 font-light truncate">Conversational Skin Diagnosis</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 sm:gap-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer shrink-0"
          title="Reset conversation"
        >
          <RotateCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span className="text-[11px] sm:text-xs">Reset</span>
        </button>
      </div>

      {/* Live Detected Profile Summary Banner */}
      <div className="bg-[#FAF5F3] px-3 sm:px-6 py-2 sm:py-3 border-b border-[#78534a]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-semibold text-[#78534a] text-[11px] sm:text-xs">Profile:</span>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${profile.skinType
              ? 'bg-[#004956] text-white border-[#004956]'
              : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
          >
            Skin: {profile.skinType ? profile.skinType.toUpperCase() : 'Analyzing...'}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${profile.concerns.length > 0
              ? 'bg-[#78534a] text-white border-[#78534a]'
              : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
          >
            Concerns: {profile.concerns.length > 0 ? profile.concerns.join(', ') : 'Identifying...'}
          </span>

          {profile.sensitivity && (
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border bg-amber-800 text-white border-amber-800">
              Sensitivity: {profile.sensitivity.replace('_', ' ')}
            </span>
          )}

          {profile.sunExposure && (
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border bg-[#c47c5d] text-white border-[#c47c5d]">
              Sun: {profile.sunExposure.toUpperCase()}
            </span>
          )}
        </div>

        {canAssemble && (
          <button
            onClick={handleCompleteAndAssemble}
            disabled={submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-[#004956] text-white hover:bg-[#004956]/90 font-medium transition-all shadow-xs cursor-pointer text-xs shrink-0"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Assemble Routine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Messages Stream Container */}
      <div
        ref={chatContainerRef}
        className="p-3 sm:p-6 h-[340px] sm:h-[400px] md:h-[420px] max-h-[50vh] sm:max-h-[55vh] overflow-y-auto space-y-3 sm:space-y-4 bg-[#FDF9F8]/60 scrollbar-thin scrollbar-thumb-stone-300"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex items-start gap-2 sm:gap-2.5 max-w-[92%] sm:max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs ${msg.sender === 'user' ? 'bg-[#78534a]' : 'bg-[#004956]'
                  }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              <div
                className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs break-words [overflow-wrap:anywhere] ${msg.sender === 'user'
                  ? 'bg-[#78534a] text-white rounded-tr-none'
                  : 'bg-white text-[#4A4543] border border-[#78534a]/15 rounded-tl-none'
                  }`}
              >
                <p className="whitespace-pre-line font-sans">{msg.text}</p>
                <span
                  className={`block text-[9px] sm:text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-stone-400'
                    }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            {msg.sender === 'ai' &&
              msg.suggestions &&
              msg.suggestions.length > 0 &&
              msg.id === messages[messages.length - 1]?.id && (
                <div className="ml-8 sm:ml-10 mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (suggestion.includes('Generate My Routine')) {
                          handleCompleteAndAssemble();
                        } else {
                          handleSendMessage(suggestion);
                        }
                      }}
                      disabled={isTyping || submitting}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs rounded-full border border-[#004956]/30 bg-white text-[#004956] hover:bg-[#004956] hover:text-white transition-all shadow-xs cursor-pointer font-medium"
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
          <div className="flex items-center gap-2 sm:gap-2.5 text-stone-400 text-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#004956] text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="bg-white border border-stone-200 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#004956] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#004956] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#004956] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="break-words">{error}</span>
          </div>
        )}
      </div>

      {/* Input controls & Submit trigger */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#78534a]/10 flex flex-col gap-2 sm:gap-3">
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
            placeholder="Type your reply (e.g. My skin gets oily around noon...)"
            disabled={isTyping || submitting}
            className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-stone-300 focus:border-[#004956] focus:ring-1 focus:ring-[#004956] outline-none text-xs sm:text-sm text-[#4A4543] placeholder:text-stone-400 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping || submitting}
            className="p-2.5 sm:p-3 rounded-xl bg-[#004956] hover:bg-[#004956]/90 disabled:bg-stone-200 text-white disabled:text-stone-400 transition-all cursor-pointer shadow-xs shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] text-stone-500 px-1 gap-1">
          <span>Powered by Grok AI Aesthetician</span>
          {canAssemble && (
            <button
              onClick={handleCompleteAndAssemble}
              disabled={submitting}
              className="text-[#78534a] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>See Routine</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
