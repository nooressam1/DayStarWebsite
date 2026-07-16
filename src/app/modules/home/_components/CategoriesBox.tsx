import React from "react";
import Image from 'next/image'

import { categoryProps } from "@/utils/types/componentType";

export function CategoriesBox({ photo, categoryName }: categoryProps) {
    return (
        <div className="relative rounded-sm md:rounded-2xl w-full md:h-[412px] h-[150px]  overflow-hidden cursor-pointer group">
            <Image
                src={photo}
                alt={categoryName}
                fill
                sizes="232px"
                className="object-cover  group-hover:scale-105 transition-transform duration-300"
            />

            <div className="w-full h-full bg-brand-primary-brown/20" />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-serif font-semibold text-lg z-10">
                {categoryName}
            </span>
        </div>
    );
}
