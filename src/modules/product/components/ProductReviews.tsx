"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Star, ChevronDown, PenLine } from "lucide-react";
import { CustomButton } from "@/modules/shared";
import { useAuthModalStore, useProductReviewsQuery, useCreateReviewMutation } from "@/app/api/hooks";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createProductReview } from "@/app/api/endpoints/product.endpoint";
import { useQueryClient } from "@tanstack/react-query";

import { Review } from "@/app/api/types";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { openModal } = useAuthModalStore();

  // React Query Data Fetching
  const { data: reviews = [], isLoading: loading } = useProductReviewsQuery(productId);

  // Local UI State
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formError, setFormError] = useState("");

  // Populate reviewer name from authenticated user details
  useEffect(() => {
    if (user) {
      const emailName = user.email ? user.email.split("@")[0] : "";
      setFormName(user.user_metadata?.full_name || user.user_metadata?.username || emailName || "");
    } else {
      setFormName("");
    }
  }, [user]);

  // Calculate Average Rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  // Sort Reviews
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "newest") {
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === "highest") {
        return b.rating - a.rating;
      }
      if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });
  }, [reviews, sortBy]);

  const createReviewMutation = useCreateReviewMutation(productId);

  // Handle Review Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formBody.trim()) {
      setFormError("Please fill out all fields.");
      return;
    }

    setFormError("");
    const reviewData = {
      rating: formRating,
      title: formTitle.trim(),
      body: formBody.trim(),
      username: formName.trim(),
    };

    try {
      const created = await createReviewMutation.mutateAsync(reviewData);
      if (!created) {
        setFormError("Failed to submit review. Are you logged in?");
        return;
      }

      // Reset Form
      setFormRating(5);
      setFormTitle("");
      setFormBody("");
      setFormError("");
      setShowForm(false);
    } catch {
      setFormError("Failed to submit review. Are you logged in?");
    }
  };

  // Format date helper
  const formatDate = (review: Review) => {
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
          return (
            <button
              key={star}
              type={interactive ? "button" : undefined}
              disabled={!interactive}
              onClick={() => interactive && setFormRating(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? "cursor-pointer p-0.5 transition-transform hover:scale-110" : "cursor-default"}`}
            >
              <Star
                className={`w-4 h-4 ${
                  isFilled
                    ? "fill-[#78534a] text-[#78534a]"
                    : "fill-transparent text-[#78534a]/30"
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="border-t border-[#78534a]/15 pt-12 mt-12 font-sans text-[#78534a]">
      {/* Header / Summary Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-[#78534a]/10">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            {renderStars(Math.round(averageRating))}
            <span className="font-bold text-sm">
              {averageRating > 0 ? averageRating.toFixed(1) : "No reviews yet"}
            </span>
            <span className="text-xs text-[#78534a]/60">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* Action Button */}
        <CustomButton
          variant="outline"
          onClick={() => {
            if (!user) {
              openModal("login");
            } else {
              setShowForm(!showForm);
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-[#78534a]/30 hover:border-[#78534a] hover:bg-[#78534a]/5 text-xs font-semibold tracking-wider uppercase transition-all"
        >
          <PenLine className="w-4 h-4" />
          <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
        </CustomButton>
      </div>

      {/* Inline Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="my-8 p-6 bg-white border border-[#78534a]/20 rounded-xl shadow-xs flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <h3 className="font-serif text-lg font-bold text-[#78534a]">
            Write a Review
          </h3>

          {formError && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
              {formError}
            </div>
          )}

          {/* Rating Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#78534a]/80">
              Your Rating <span className="text-red-500">*</span>
            </label>
            {renderStars(formRating, true)}
          </div>

          {/* Reviewer Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#78534a]/80">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Sarah M."
              className="w-full px-3.5 py-2 border border-[#78534a]/20 rounded-md text-xs font-sans focus:outline-hidden focus:border-[#78534a] text-[#78534a]"
              required
            />
          </div>

          {/* Review Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#78534a]/80">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Give your review a headline..."
              className="w-full px-3.5 py-2 border border-[#78534a]/20 rounded-md text-xs font-sans focus:outline-hidden focus:border-[#78534a] text-[#78534a]"
              required
            />
          </div>

          {/* Review Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#78534a]/80">
              Review Details <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              rows={4}
              placeholder="Write your review here. What did you like or dislike?"
              className="w-full px-3.5 py-2 border border-[#78534a]/20 rounded-md text-xs font-sans focus:outline-hidden focus:border-[#78534a] text-[#78534a] resize-none"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-[#78534a]/70 hover:text-[#78534a] cursor-pointer"
            >
              Cancel
            </button>
            <CustomButton
              type="submit"
              variant="solid"
              className="px-6 py-2 bg-[#78534a] hover:bg-[#78534a]/90 text-white text-xs font-semibold rounded-md shadow-xs transition-all cursor-pointer"
            >
              Submit Review
            </CustomButton>
          </div>
        </form>
      )}

      {/* Reviews Header & Sorting */}
      {reviews.length > 0 && (
        <div className="flex justify-between items-center my-6">
          <span className="text-xs text-[#78534a]/60">
            Showing {sortedReviews.length} {sortedReviews.length === 1 ? "review" : "reviews"}
          </span>

          {/* Sort Selector */}
          <div className="relative inline-flex items-center gap-1.5 text-xs text-[#78534a]/80 font-medium">
            <span>Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "highest" | "lowest")}
                className="appearance-none bg-transparent pr-6 pl-2 py-1 font-bold text-[#78534a] cursor-pointer focus:outline-hidden"
              >
                <option value="newest">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#78534a]" />
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#78534a]/60">
          Loading reviews...
        </div>
      ) : sortedReviews.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#78534a]/60 bg-[#FAF5F3]/50 rounded-xl my-6">
          Be the first to review this product!
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#78534a]/10">
          {sortedReviews.map((review) => (
            <div key={review.id} className="py-6 flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="font-bold text-sm text-[#78534a]">
                      {review.title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#78534a]/80">
                    {review.username}
                  </span>
                </div>
                <span className="text-xs text-[#78534a]/45">
                  {formatDate(review)}
                </span>
              </div>
              <p className="text-xs text-[#78534a]/80 leading-relaxed font-work mt-1">
                {review.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
