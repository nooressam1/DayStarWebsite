"use client";

import React from "react";

export interface SkeletonBoxProps {
    className?: string;
    children?: React.ReactNode;
}

export function SkeletonBox({ className = "", children }: SkeletonBoxProps) {
    return (
        <div className={`relative overflow-hidden bg-stone-300/85 animate-pulse ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            {children}
        </div>
    );
}

export function SkeletonText({
    lines = 1,
    className = "h-4 w-full bg-stone-300/80 rounded-md",
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {Array.from({ length: lines }).map((_, i) => (
                <SkeletonBox
                    key={i}
                    className={`${className} ${i === lines - 1 && lines > 1 ? "w-3/4" : ""}`}
                />
            ))}
        </div>
    );
}

export function SkeletonButton({ className = "h-12 w-full bg-stone-400/90 rounded-xl" }: { className?: string }) {
    return <SkeletonBox className={className} />;
}

export function SkeletonInput({ className = "h-11 w-full bg-stone-300/80 rounded-lg" }: { className?: string }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <SkeletonBox className="h-3.5 w-24 rounded-md" />
            <SkeletonBox className={className} />
        </div>
    );
}

export default SkeletonBox;
