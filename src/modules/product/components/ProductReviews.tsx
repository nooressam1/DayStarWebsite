"use client";

import React, { useState } from "react";
import { Star, ChevronDown, PenLine } from "lucide-react";
import { CustomButton } from "@/modules/shared";
import { useProductReviews } from "../hooks/useProductReviews";
import { useAuthModalStore } from "@/modules/auth/hooks/useAuthModalStore";
import { useAuth } from "@/lib/supabase/auth-provider";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();

  const {
    reviews,
    loading,
    sortBy,
    setSortBy,
    showForm,
    setShowForm,
    formName,
    setFormName,
    formRating,
    setFormRating,
    hoverRating,
    setHoverRating,
    formTitle,
    setFormTitle,
    formBody,
    setFormBody,
    formError,
    averageRating,
    sortedReviews,
    handleSubmit,
  } = useProductReviews(productId);

  // Format date helper
  const formatDate = (review: any) => {
    if (review.created_at) {
      try {
        return new Date(review.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' });
      } catch {
        // Fallback
      }
    }
    if (typeof review.date === 'number') {
      return new Date(review.date * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' });
    }
    return review.date || "Just now";
  };

  // Helper to render stars
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const displayRating = interactive && hoverRating !== null ? hoverRating : rating;
          const isFilled = star <= displayRating;
          const isHalf = !isFilled && star - 0.5 <= displayRating;

          return (
            <button
              key={star}
              type={interactive ? "button" : "button"}
              disabled={!interactive}
              onClick={() => interactive && setFormRating(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? "cursor-pointer transition-transform hover:scale-110 focus:outline-none" : "cursor-default"}`}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`h-5 w-5 ${isFilled
                  ? "fill-[#78534a] text-[#78534a]"
                  : isHalf
                    ? "fill-[#78534a]/50 text-[#78534a]"
                    : "text-gray-300"
                  }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full mt-16 border-t border-[#78534a]/15 pt-12">
      {/* Header / Summary Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-[#78534a]/10">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-3xl font-bold text-brand-primary-brown">Reviews</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-sans font-bold text-lg text-brand-primary-brown">{averageRating}</span>
              {renderStars(averageRating)}
              <span className="text-sm text-brand-gray ml-2">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Sort Dropdown */}
          <div className="relative flex items-center gap-2">
            <span className="text-sm font-sans text-brand-gray">Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#78534a]/20 text-brand-primary-brown text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-brand-primary-brown font-medium cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-primary-brown pointer-events-none" />
            </div>
          </div>

          {/* Toggle Write Review Form */}
          <CustomButton
            variant={showForm ? "solid" : "outline"}
            colorScheme="primary"
            icon={PenLine}
            onClick={() => {
              if (!user) {
                openModal("login");
              } else {
                setShowForm(!showForm);
              }
            }}
            className="text-xs uppercase font-semibold tracking-wider px-5 py-3 rounded-lg"
          >
            {showForm ? "Cancel Review" : "Write A Review"}
          </CustomButton>
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <div className="mb-12 bg-[#FAF5F3] border border-[#78534a]/15 rounded-2xl p-6 md:p-8 shadow-sm w-full animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-serif text-xl font-bold text-brand-primary-brown mb-6">Write a Customer Review</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {formError && (
              <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {formError}
              </div>
            )}

            {/* Rating Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-brand-primary-brown">Rating</label>
              <div className="flex items-center gap-2">
                {renderStars(formRating, true)}
                <span className="text-xs text-brand-gray font-medium">
                  {formRating === 5
                    ? "Excellent"
                    : formRating === 4
                      ? "Good"
                      : formRating === 3
                        ? "Average"
                        : formRating === 2
                          ? "Fair"
                          : "Poor"}
                </span>
              </div>
            </div>

            {/* User Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reviewer-name" className="text-sm font-medium text-brand-primary-brown">
                Name
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Sarah M."
                className="bg-white border border-[#78534a]/20 rounded-lg px-4 py-2.5 text-sm text-brand-primary-brown focus:outline-none focus:border-brand-primary-brown w-full transition-colors"
                maxLength={40}
              />
            </div>

            {/* Review Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reviewer-title" className="text-sm font-medium text-brand-primary-brown">
                Review Title
              </label>
              <input
                id="reviewer-title"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Summarize your experience..."
                className="bg-white border border-[#78534a]/20 rounded-lg px-4 py-2.5 text-sm text-brand-primary-brown focus:outline-none focus:border-brand-primary-brown w-full transition-colors"
                maxLength={100}
              />
            </div>

            {/* Review Body */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reviewer-body" className="text-sm font-medium text-brand-primary-brown">
                Review Details
              </label>
              <textarea
                id="reviewer-body"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                placeholder="Tell us what you liked or disliked about this product..."
                rows={4}
                className="bg-white border border-[#78534a]/20 rounded-lg px-4 py-2.5 text-sm text-brand-primary-brown focus:outline-none focus:border-brand-primary-brown w-full transition-colors resize-none"
                maxLength={1000}
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <CustomButton
                type="submit"
                variant="solid"
                colorScheme="primary"
                className="text-xs uppercase font-semibold tracking-wider px-6 py-3 rounded-lg"
              >
                Submit Review
              </CustomButton>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="text-center py-12 text-brand-gray bg-[#FAF5F3]/50 rounded-xl border border-[#78534a]/10 p-8 shadow-sm">
            <p>Loading reviews...</p>
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="text-center py-12 text-brand-gray bg-[#FAF5F3]/50 rounded-xl border border-[#78534a]/10 p-8 shadow-sm">
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-4 border-b border-[#78534a]/10 pb-10 last:border-0 last:pb-0 animate-in fade-in duration-300">
              {/* User and Date header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {/* Avatar Circle */}
                  <div className="h-12 w-12 rounded-full bg-[#8b695e] flex items-center justify-center text-white font-serif font-bold text-sm shadow-inner">
                    {review.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-brand-primary-brown text-base leading-tight">
                      {review.username}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="font-sans text-xs text-brand-primary-brown font-semibold">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-sans mt-1">
                  {formatDate(review)}
                </span>
              </div>

              {/* Review content */}
              <div className="flex flex-col gap-2 pl-0 md:pl-[60px]">
                <h5 className="font-serif text-lg font-bold text-brand-primary-brown leading-snug">
                  {review.title}
                </h5>
                <p className="font-sans text-sm text-brand-gray leading-relaxed max-w-3xl">
                  {review.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
