"use client";

import React from "react";
import { ItemsCarousel } from "@/modules/shared";
import { TestimonialCard } from "@/modules/home";
import { useFeaturedReviewsQuery } from "@/app/api/hooks/useProductQueries";

export function TestimonialsSection() {
    const { data: reviews = [], isLoading } = useFeaturedReviewsQuery(10);

    // Filter to ensure only reviews with actual written comments (not empty, not just stars)
    const validTestimonials = reviews
        .filter((r) => {
            const text = (r.body || r.comment || "").trim();
            // Ensure meaningful text length (at least 10 characters)
            return text.length >= 10;
        })
        .map((r) => ({
            id: r.id,
            quote: (r.body || r.comment)!,
            author: r.username || (r as any).profile?.username || "Verified Customer",
            role: (r as any).product?.name ? `Reviewed ${(r as any).product.name}` : undefined,
        }));

    // If still loading or there are no reviews with written comments yet, don't show the section
    if (isLoading || validTestimonials.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6 items-center w-full">

            <h1 className="text-brand-primary-brown text-start md:text-center font-bold font-serif text-md md:text-2xl">
                What Our Clients Say
            </h1>

            <ItemsCarousel
                items={validTestimonials}
                itemsPerPage={4}
                responsive={{
                    md: 2, // 2 items on tablets (< 1024px)
                    sm: 1, // 1 item on mobile (< 640px)
                }}
                gridClassName="grid grid-cols-1 flex items-center justify-center  sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                renderItem={(item) => (
                    <TestimonialCard
                        quote={item.quote}
                        author={item.author}
                        role={item.role}
                    />
                )}
            />
        </div>
    );
}

export default TestimonialsSection;
