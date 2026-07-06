import { useState, useMemo } from "react";
import { Review } from "@/utils/types/type";

// Initial mock reviews related to skincare
const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    username: "Sarah M.",
    rating: 5,
    date: "2 Weeks ago",
    title: "Absolute game changer for dry skin!",
    body: "I've been using this product for about two weeks now, and my skin barrier has never felt healthier. It provides deep hydration without feeling heavy or greasy. Perfect under makeup too!",
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    id: "rev-2",
    username: "Emily R.",
    rating: 4,
    date: "1 Month ago",
    title: "Smells amazing and feels so rich",
    body: "A very luxurious texture and has a beautiful, natural scent. It is a bit too rich for my daytime use during summer, but it works wonders as a deep-restoring night cream. Will definitely buy again.",
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: "rev-3",
    username: "Michael K.",
    rating: 4.5,
    date: "1 Month ago",
    title: "Highly recommend for sensitive skin",
    body: "I always struggle with redness when trying new skincare, but this formula was incredibly gentle and soothing. Noticed a calmer complexion within just three days.",
    timestamp: Date.now() - 31 * 24 * 60 * 60 * 1000,
  },
];

export function useProductReviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formError, setFormError] = useState("");

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
        return b.timestamp - a.timestamp;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formBody.trim()) {
      setFormError("Please fill out all fields.");
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      username: formName.trim(),
      rating: formRating,
      date: "Just now",
      title: formTitle.trim(),
      body: formBody.trim(),
      timestamp: Date.now(),
    };

    setReviews([newReview, ...reviews]);

    // Reset Form
    setFormName("");
    setFormRating(5);
    setFormTitle("");
    setFormBody("");
    setFormError("");
    setShowForm(false);
  };

  return {
    reviews,
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
