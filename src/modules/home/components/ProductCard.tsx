"use client";
import React, { useState, useEffect } from "react";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { CustomButton, FavoriteButton } from "@/modules/shared";
import { Product } from "@/app/api/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProductSalePrice, isProductOnSale, getProductDiscountPercentage } from "@/modules/product";
import { sanitizeProductImage } from "@/utils/image/image.utils";

export function ProductCard({ product }: { product: Product }) {
    const router = useRouter();
    const [imgSrc, setImgSrc] = useState<string>(() => sanitizeProductImage(product.images));

    useEffect(() => {
        setImgSrc(sanitizeProductImage(product.images));
    }, [product.images]);

    const onSale = isProductOnSale(product);
    const salePrice = getProductSalePrice(product);
    const discountPercent = getProductDiscountPercentage(product);

    const hasVariants = Boolean(product.variants && product.variants.length > 0);
    const totalStock = hasVariants
        ? product.variants!.reduce((acc, v) => acc + (v.stock ?? 0), 0)
        : undefined;

    const isOutOfStock = hasVariants && totalStock !== undefined && totalStock <= 0;
    const isLowStock = hasVariants && totalStock !== undefined && totalStock > 0 && totalStock < 10;

    return (
        <div
            onClick={() => router.push(`/product/${product.slug}`)}
            className="group flex flex-col gap-1 sm:gap-2 w-full h-full border border-brand-primary-brown/10 rounded-lg overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer"
        >
            <div className="relative w-full aspect-[4/5] bg-[#faf5f3] overflow-hidden">
                {/* Badges Stack */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
                    {onSale && (
                        <span className="bg-[#c94a29] text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase shadow-sm w-fit">
                            {discountPercent > 0 ? `${discountPercent}% OFF` : "Sale"}
                        </span>
                    )}
                    {isOutOfStock ? (
                        <span className="bg-stone-900/90 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase shadow-sm w-fit">
                            Out of Stock
                        </span>
                    ) : isLowStock ? (
                        <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase shadow-sm w-fit">
                            Low Stock ({totalStock})
                        </span>
                    ) : null}
                </div>
                <Image
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    src={imgSrc}
                    alt={product.name}
                    onError={() => {
                        setImgSrc("/no-image.png");
                    }}
                />
            </div>
            <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-4 flex-1 justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-black text-xs sm:text-base md:text-lg font-medium line-clamp-2 leading-snug">
                        {product.name}
                    </h3>
                    {onSale ? (
                        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                            <span className="font-work text-brand-primary-brown font-bold text-xs sm:text-sm md:text-base">
                                {formatMoney(salePrice)}
                            </span>
                            <span className="font-sans line-through text-[11px] sm:text-xs text-gray-400">
                                {formatMoney(product.price)}
                            </span>
                        </div>
                    ) : (
                        <p className="font-work text-brand-light-brown font-semibold text-xs sm:text-sm md:text-base truncate">
                            {formatMoney(product.price)}
                        </p>
                    )}
                </div>
                <div
                    className="flex flex-row gap-2 hidden md:flex"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomButton
                        key={"add_to_cart"}
                        variant={"solid"}
                        colorScheme={"primary"}
                        onClick={() => {
                            router.push(`/product/${product.slug}`);
                        }}
                        className="py-4 px-2 w-full flex-1 text-sm font-normal rounded-lg"
                    >
                        View
                    </CustomButton>
                    <FavoriteButton product={product} />
                </div>
            </div>
        </div>
    )
}