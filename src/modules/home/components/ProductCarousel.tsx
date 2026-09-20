"use client";
import { useState, useEffect } from "react";
import { Product } from "@/app/api/types";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductCarousel({ products }: { products: Product[] }) {
    const [current, setCurrent] = useState(0);
    const [isDesktop, setIsDesktop] = useState(true);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    if (!products.length) return null;

    // Desktop: 1 product beside the banner
    // Small screens: 2 products side by side (if available)
    const perPage = isDesktop ? 1 : Math.min(2, products.length);
    const totalPages = Math.ceil(products.length / perPage);
    const safeCurrent = Math.min(current, Math.max(0, totalPages - 1));

    const visibleProducts = products.slice(
        safeCurrent * perPage,
        safeCurrent * perPage + perPage
    );

    const handlePrev = () => {
        setCurrent((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev + 1 < totalPages ? prev + 1 : 0));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) handleNext();
            else handlePrev();
        }
        setTouchStartX(null);
    };

    return (
        <div
            className="flex flex-col gap-3 w-full h-full justify-between min-w-0"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-full flex-1 min-w-0 flex flex-col justify-center">
                {totalPages > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="hidden sm:flex absolute -left-2.5 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-[#78534a]/20 shadow-md text-brand-primary-brown items-center justify-center hover:bg-brand-primary-brown hover:text-white transition-all cursor-pointer"
                            aria-label="Previous product"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="hidden sm:flex absolute -right-2.5 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-[#78534a]/20 shadow-md text-brand-primary-brown items-center justify-center hover:bg-brand-primary-brown hover:text-white transition-all cursor-pointer"
                            aria-label="Next product"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}
                <div className={`w-full min-w-0 ${perPage > 1 ? "grid grid-cols-2 gap-3 sm:gap-4" : "flex flex-col"}`}>
                    {visibleProducts.map((product) => (
                        <div key={product.id} className="w-full min-w-0 flex-1">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
            {totalPages > 1 && (
                <div className="flex flex-row gap-2 justify-center items-center pt-1 shrink-0">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrent(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === safeCurrent
                                ? "w-8 bg-brand-primary-brown"
                                : "w-3 bg-brand-primary-brown/30 hover:bg-brand-primary-brown/60"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
