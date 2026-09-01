"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { sanitizeImageUrl } from "@/utils/image/image.utils";

export interface categoryProps {
  photo?: string | null;
  categoryName: string;
}

export function CategoriesBox({ photo, categoryName }: categoryProps) {
    const [imgSrc, setImgSrc] = useState<string>(() => sanitizeImageUrl(photo));

    useEffect(() => {
        setImgSrc(sanitizeImageUrl(photo));
    }, [photo]);

    return (
        <div className="relative rounded-sm md:rounded-2xl w-full md:h-[412px] h-[150px] overflow-hidden cursor-pointer group bg-brand-primary-brown/10">
            <Image
                src={imgSrc}
                alt={categoryName || "Category"}
                fill
                sizes="(max-width: 768px) 50vw, 232px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => {
                    setImgSrc("/no-image.png");
                }}
            />

            <div className="w-full h-full bg-brand-primary-brown/20" />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-serif font-semibold text-lg z-10 text-center px-2">
                {categoryName}
            </span>
        </div>
    );
}
