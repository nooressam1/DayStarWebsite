"use client";
import React, { useState } from "react";
import { sanitizeImageUrl } from "@/utils/image/image.utils";

export interface ProductCarouselProps {
  images: string[];
  productName: string;
}

export default function ImageCarousel({
  images,
  productName,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Safety net: Filter out invalid/blob strings and use fallback if empty
  const validImages = Array.isArray(images)
    ? images.map((img) => sanitizeImageUrl(img)).filter((img) => img !== "/no-image.png")
    : [];

  const displayImages = validImages.length > 0 ? validImages : ["/no-image.png"];

  return (
    <div className="w-full max-w-lg  flex flex-col md:flex-row  items-start">
      {/* Thumbnail List */}
      {displayImages.length >= 1 && (
        <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 w-full md:w-28 pb-2 md:pb-0 scrollbar-none shrink-0 overflow-x-auto md:overflow-y-auto">
          {displayImages.map((src, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 focus:outline-none ${isActive
                  ? "border-brand-primary-brown scale-95 shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <img
                  src={src}
                  alt={`Thumbnail indicator ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Display Box with Fixed Consistent Dimensions */}
      <div className="relative order-1 md:order-2 aspect-square w-full h-[320px] sm:h-[450px] md:h-[500px] bg-white rounded-2xl overflow-hidden border border-brand-light-brown/10 shadow-sm group shrink-0">
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
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}