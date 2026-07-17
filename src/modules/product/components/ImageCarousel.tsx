"use client";
import { ProductCarouselProps } from "@/utils/types/componentType";
import React, { useState } from "react";

export default function ImageCarousel({
  images,
  productName,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Safety net: Use fallback if the image array from Supabase is empty
  const hasImages =
    Array.isArray(images) &&
    images.length > 0 &&
    images.some((img) => img && typeof img === "string" && img.trim() !== "");

  const displayImages = hasImages ? images : ["/no-image.png"];


  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
      {displayImages.length >= 1 && (
        <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 w-full md:w-36 pb-2 md:pb-0 scrollbar-none">
          {displayImages.map((src, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-28 h-28  md:w-36 md:h-36 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 focus:outline-none ${isActive
                  ? "border-brand-primary-brown scale-95 shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <img
                  src={src}
                  alt={`Thumbnail indicator ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="relative order-1 md:order-2 aspect-square w-full bg-white rounded-2xl overflow-hidden border border-brand-light-brown/10 shadow-sm group">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayImages.map((src, index) => (
            <div key={index} className="w-full h-full shrink-0">
              <img
                src={src}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}