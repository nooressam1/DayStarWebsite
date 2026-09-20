import React from "react";

export interface TestimonialCardProps {
    quote: string;
    author: string;
    role?: string;
    className?: string;
}

export function TestimonialCard({
    quote,
    author,
    role,
    className = "",
}: TestimonialCardProps) {
    return (
        <div
            className={`bg-white rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-between text-center gap-6 sm:gap-8 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-300 w-full max-w-[360px] min-h-[320px] ${className}`}
        >
            {/* Top Quote Icon */}
            <div className="flex items-center justify-center pt-1">
                <svg
                    className="w-10 h-10 text-brand-primary-brown/80 fill-current select-none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
            </div>

            {/* Testimonial Quote Text */}
            <p className="font-sans font-bold text-neutral-900 text-base sm:text-lg leading-snug tracking-tight">
                {quote}
            </p>

            {/* Author Section */}
            <div className="flex flex-col items-center gap-0.5 pb-1">
                <span className="font-serif text-sm sm:text-base text-brand-primary-brown font-medium tracking-wide">
                    {author}
                </span>
                {role && (
                    <span className="text-xs text-brand-primary-brown/60 font-sans">
                        {role}
                    </span>
                )}
            </div>
        </div>
    );
}

export default TestimonialCard;
