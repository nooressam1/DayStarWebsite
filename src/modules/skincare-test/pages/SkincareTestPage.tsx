'use client';

import React from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useSkincareTest } from "../hooks/useSkincareTest";
import { QUESTIONS } from "../utils/questions";

export default function SkincareTestPage() {
  const {
    currentStep,
    currentQuestion,
    answers,
    isAnimating,
    isLastQuestion,
    loading,
    error,
    handleOptionSelect,
    handleNext,
    handlePrevious,
    isCurrentStepValid
  } = useSkincareTest(QUESTIONS);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20 font-sans">
      <div className="w-full max-w-4xl flex flex-col">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-serif text-[#78534a] font-bold tracking-wide">
            Skin Care Test
          </h1>
          <p className="text-sm md:text-base text-[#686361]/80 mt-2 font-light">
            Learn your routine from professionals
          </p>
        </div>

        {/* Progress Tracker Segments */}
        <div className="flex gap-2 w-full mb-10 px-1">
          {QUESTIONS.map((q, idx) => {
            const isActiveOrDone = idx <= currentStep;
            return (
              <div
                key={q.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  isActiveOrDone ? "bg-[#004956]" : "bg-[#e8dfdc]"
                }`}
              />
            );
          })}
        </div>

        {/* Quiz Container Card (Questions) */}
        <div
          className={`bg-[#FDF9F8] rounded-xl shadow-md shadow-[#78534a]/5 border border-[#78534a]/10 p-8 md:p-12 min-h-[400px] flex flex-col justify-between transition-all duration-300 transform ${
            isAnimating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          <div>
            {/* Question Number */}
            <span className="text-sm md:text-md font-semibold text-secondary tracking-wide uppercase font-mono">
              Question #{currentQuestion.id}
            </span>

            {/* Question Text */}
            <h2 className="text-xl md:text-lg text-[#374151] font-medium mt-4 mb-2 leading-snug">
              {currentQuestion.title}
            </h2>

            {/* Subtitle / Helper Instruction */}
            <p className="text-[#8b7e7a] text-xs md:text-xs mb-6 mt-1 font-light tracking-wide uppercase">
              {currentQuestion.subtitle}
            </p>

            {/* Error Message if submit fails */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Option List */}
            <div className="space-y-3.5">
              {currentQuestion.options.map(option => {
                const key = currentQuestion.key;
                const isSelected = currentQuestion.type === 'single'
                  ? answers[key] === option.id
                  : (answers[key] as string[]).includes(option.id);

                return (
                  <button
                    key={option.id}
                    disabled={loading}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left flex items-center gap-4 py-4 px-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border-[#004956] bg-[#FDF9F8]/5 text-[#004956] shadow-sm shadow-[#004956]/5"
                        : "border-[#78534a]/10 bg-[#FDF9F8] text-[#374151] hover:border-[#004956]/50 hover:bg-[#faf5f3]/30"
                    } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {/* Checkbox / Radio Circle */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 ${
                        isSelected
                          ? "border-[#004956] bg-[#004956]"
                          : "border-[#78534a]/30 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>

                    {/* Label */}
                    <span className="text-sm md:text-md font-light font-sans tracking-wide">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons Row inside card */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0 || loading}
              className={`px-8 py-3.5 border border-[#004956] text-[#004956] rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2 ${
                currentStep === 0 || loading
                  ? "opacity-40 cursor-not-allowed border-gray-300 text-gray-400"
                  : "cursor-pointer hover:bg-[#004956]/5"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid() || loading}
              className={`px-8 py-3.5 bg-[#004956] text-white rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2 ${
                !isCurrentStepValid() || loading
                  ? "opacity-50 cursor-not-allowed bg-gray-400"
                  : "cursor-pointer hover:bg-[#004956]/90 hover:shadow-md"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {isLastQuestion ? "Submit" : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
