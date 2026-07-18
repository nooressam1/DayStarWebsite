"use client";
import { useState } from "react";
import { Product } from "@/app/api/types";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products }: { products: Product[] }) {
    const [current, setCurrent] = useState(0);

    if (!products.length) return null;

    return (
        <div className="flex flex-col gap-4 w-full h-full " >
            <ProductCard product={products[current]} />
            <div className="flex flex-row gap-2 justify-center">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1 w-full rounded-full transition-all duration-300 cursor-pointer ${index === current
                            ? "w-8 bg-brand-primary-brown"
                            : "w-4 bg-brand-primary-brown/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
