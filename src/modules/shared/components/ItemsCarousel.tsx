"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ItemsCarouselProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    itemsPerPage?: number;
    responsive?: {
        sm?: number; // screens < 640px (mobile)
        md?: number; // screens < 1024px (tablets / small screens)
    };
    getKey?: (item: T, index: number) => string | number;
    gridClassName?: string;
    className?: string;
    showArrows?: boolean;
    showDots?: boolean;
}

export function ItemsCarousel<T>({
    items,
    renderItem,
    itemsPerPage = 4,
    responsive,
    getKey,
    gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full",
    className = "",
    showArrows = true,
    showDots = true,
}: ItemsCarouselProps<T>) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPerPage, setCurrentPerPage] = useState(itemsPerPage);

    React.useEffect(() => {
        if (!responsive) {
            setCurrentPerPage(itemsPerPage);
            return;
        }

        const handleResize = () => {
            const width = window.innerWidth;
            if (responsive.sm !== undefined && width < 640) {
                setCurrentPerPage(responsive.sm);
            } else if (responsive.md !== undefined && width < 1024) {
                setCurrentPerPage(responsive.md);
            } else {
                setCurrentPerPage(itemsPerPage);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [responsive, itemsPerPage]);

    // Reset pagination index when page size changes
    React.useEffect(() => {
        setCurrentIndex(0);
    }, [currentPerPage]);

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / currentPerPage);

    // Reset or clamp index if items count changes
    const safeIndex = totalPages > 0 ? Math.min(currentIndex, totalPages - 1) : 0;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1 < totalPages ? prev + 1 : 0));
    };

    if (totalItems === 0) {
        return null;
    }

    const visibleItems = items.slice(
        safeIndex * currentPerPage,
        safeIndex * currentPerPage + currentPerPage
    );

    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
        setTouchStartX(null);
    };

    return (
        <div 
            className={`flex flex-col gap-4 w-full ${className}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Carousel track & arrow navigation */}
            <div className="relative w-full">
                {/* Left Arrow */}
                {showArrows && totalPages > 1 && (
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-[#78534a]/20 shadow-md text-brand-primary-brown flex items-center justify-center hover:bg-brand-primary-brown hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Grid items for current page */}
                <div className={gridClassName}>
                    {visibleItems.map((item, index) => {
                        const itemIndex = safeIndex * currentPerPage + index;
                        const key = getKey
                            ? getKey(item, itemIndex)
                            : (item as any)?.id ?? itemIndex;

                        return (
                            <div key={key} className="animate-in flex flex-row items-center justify-center gap-4 fade-in duration-300 w-full min-w-0">
                                {renderItem(item, itemIndex)}
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                {showArrows && totalPages > 1 && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs border border-[#78534a]/20 shadow-md text-brand-primary-brown flex items-center justify-center hover:bg-brand-primary-brown hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Pagination dots indicator */}
            {showDots && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 w-full pt-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to page ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === safeIndex
                                ? "w-8 bg-brand-primary-brown"
                                : "w-3 bg-brand-primary-brown/25 hover:bg-brand-primary-brown/50"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ItemsCarousel;
