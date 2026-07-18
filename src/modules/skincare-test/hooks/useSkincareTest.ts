'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SkincareQuestion } from "../utils/questions";

export interface SkincareAnswersState {
  skinType: string;
  concerns: string[];
  sensitivity: string;
  goals: string[];
  sunExposure: string;
}
import { apiClient } from "@/app/api/utils/client";
import { ENDPOINTS } from "@/app/api/constants/endpoints";

export function useSkincareTest(questions: SkincareQuestion[]) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SkincareAnswersState>({
    skinType: "",
    concerns: [],
    sensitivity: "",
    goals: [],
    sunExposure: ""
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = questions.length;
  const isLastQuestion = currentStep === totalSteps - 1;
  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;

    const key = currentQuestion.key;
    if (currentQuestion.type === 'single') {
      setAnswers(prev => ({
        ...prev,
        [key]: optionId
      }));
    } else {
      setAnswers(prev => {
        const currentList = prev[key] as string[];
        const updatedList = currentList.includes(optionId)
          ? currentList.filter(id => id !== optionId)
          : [...currentList, optionId];
        return {
          ...prev,
          [key]: updatedList
        };
      });
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setLoading(true);
      setError(null);
      try {
        // Send POST request directly upon submission event to prevent double runs
        const routineData = await apiClient.request<Record<string, any>>(ENDPOINTS.QUIZ.SUBMIT, undefined, {
          method: "POST",
          body: JSON.stringify({
            skinType: answers.skinType,
            concerns: answers.concerns,
            sensitivity: answers.sensitivity
          })
        });

        // Store result routine and profile answer details in sessionStorage
        sessionStorage.setItem('skincare_results_routine', JSON.stringify(routineData));
        sessionStorage.setItem('skincare_results_answers', JSON.stringify(answers));

        // Navigate to the separate results view page
        router.push("/skincare-test/results");
      } catch (err: any) {
        console.error("Failed to submit skincare test quiz:", err);
        setError(err.message || "An error occurred while submitting your test. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 250);
  };

  const handlePrevious = () => {
    if (currentStep === 0) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 250);
  };

  // Helper validation to see if the current question has an answer
  const isCurrentStepValid = () => {
    if (!currentQuestion) return false;
    const key = currentQuestion.key;
    const value = answers[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "";
  };

  return {
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
  };
}
