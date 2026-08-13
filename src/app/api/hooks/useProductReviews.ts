import { useState, useMemo, useEffect } from "react";
import { Review } from "@/app/api/types";
import { createProductReview } from "@/app/api/endpoints/product.endpoint";
import { useAuth } from "@/lib/supabase/auth-provider";
import { useProductReviewsQuery } from "./useProductQueries";
import { useQueryClient } from "@tanstack/react-query";

export function useProductReviews(productId: string) {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading: loading } = useProductReviewsQuery(productId);

  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formError, setFormError] = useState("");

  const { user } = useAuth();

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

    const created = await createProductReview(productId, reviewData);
    if (!created) {
      setFormError("Failed to submit review. Are you logged in?");
      return;
    }

    // Invalidate React Query cache so the new review is re-fetched and updated everywhere
    queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });

    // Reset Form
    setFormRating(5);
    setFormTitle("");
    setFormBody("");
    setFormError("");
    setShowForm(false);
  };

  return {
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
  };
}
