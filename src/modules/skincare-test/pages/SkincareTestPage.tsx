'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { QUESTIONS } from "../utils/questions";
import { apiClient } from "@/app/api/utils/client";
import { ENDPOINTS } from "@/app/api/constants/endpoints";

export default function SkincareTestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    skinType: "",
    concerns: [],
    sensitivity: "",
    goals: [],
    sunExposure: "",
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUESTIONS.length;
  const isLastQuestion = currentStep === totalSteps - 1;
  const currentQuestion = QUESTIONS[currentStep];

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;

    const key = currentQuestion.key;
    if (currentQuestion.type === "single") {
      setAnswers((prev) => ({
        ...prev,
        [key]: optionId,
      }));
    } else {
      setAnswers((prev) => {
        const currentList = (prev[key] as string[]) || [];
        const updatedList = currentList.includes(optionId)
          ? currentList.filter((id) => id !== optionId)
          : [...currentList, optionId];
        return {
          ...prev,
          [key]: updatedList,
        };
      });
    }
  };

  const isCurrentStepValid = () => {
    if (!currentQuestion) return false;
    const key = currentQuestion.key;
    const value = answers[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "";
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setLoading(true);
      setError(null);
      try {
        const routineData = await apiClient.request<Record<string, unknown>>(ENDPOINTS.QUIZ.SUBMIT, undefined, {
          method: "POST",
          body: JSON.stringify({
            skinType: answers.skinType,
            concerns: answers.concerns,
            sensitivity: answers.sensitivity,
          }),
        });

        sessionStorage.setItem("skincare_results_routine", JSON.stringify(routineData));
        sessionStorage.setItem("skincare_results_answers", JSON.stringify(answers));

        router.push("/skincare-test/results");
      } catch (err: unknown) {
        console.error("Failed to submit skincare test quiz:", err);
        const errorMessage = (err as { message?: string })?.message || "An error occurred while submitting your test. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsAnimating(false);
    }, 250);
  };

  const handlePrevious = () => {
    if (currentStep === 0) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 250);
  };

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

        {/* Quiz Container Card */}
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

            {/* Question Title & Subtitle */}
            <h2 className="text-xl md:text-2xl font-serif text-[#78534a] font-bold mt-2">
              {currentQuestion.title}
            </h2>
            <p className="text-xs md:text-sm text-[#686361]/70 mt-1 font-light">
              {currentQuestion.subtitle}
            </p>

            {/* Options List */}
            <div className="mt-8 flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const currentAnswer = answers[currentQuestion.key];
                const isSelected =
                  currentQuestion.type === "single"
                    ? currentAnswer === option.id
                    : Array.isArray(currentAnswer) && currentAnswer.includes(option.id);

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#004956] text-white border-[#004956] shadow-sm"
                        : "bg-white text-[#78534a] border-[#78534a]/15 hover:border-[#78534a]/40 hover:bg-[#FAF5F3]"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-sans font-semibold text-sm md:text-base">
                        {option.label}
                      </span>
                      {option.description && (
                        <span
                          className={`text-xs mt-0.5 font-light ${
                            isSelected ? "text-white/80" : "text-[#686361]/70"
                          }`}
                        >
                          {option.description}
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-white bg-white/20 text-white"
                          : "border-[#78534a]/30"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs md:text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#78534a]/10">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0 || loading}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 0 || loading
                  ? "opacity-0 pointer-events-none"
                  : "text-[#78534a] hover:bg-[#78534a]/5 cursor-pointer"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid() || loading}
              className={`flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isCurrentStepValid() && !loading
                  ? "bg-[#78534a] text-white hover:bg-[#78534a]/95 shadow-sm hover:shadow-md"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>{isLastQuestion ? "Complete & See Routine" : "Next Question"}</span>
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
