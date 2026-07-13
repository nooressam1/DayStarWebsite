"use client";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import CustomButton from "../../shared/component/CustomButton";
import FavoriteButton from "../../shared/component/FavoriteButton";
import { Product } from "@/utils/types/type";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
    const router = useRouter();
    const displayImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/150x150?text=No+Image";

    return (
        <div className="flex flex-col gap-2 w-full h-full border border-brand-primary-brown/10 rounded-lg">
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] ">
                {product.on_sale && (
                    <span className="absolute top-3 left-3 bg-[#c94a29] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase z-10 shadow-sm">
                        Sale
                    </span>
                )}
                <Image fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover rounded-lg" src={displayImage} alt={product.name} />
            </div>
            <div className="p-4 flex flex-col gap-5">
                <div className="flex flex-col ">
                    <h1 className="font-serif text-black text-lg truncate">{product.name}</h1>
                    {product.on_sale && product.sale_price ? (
                        <div className="flex items-center gap-2">
                            <span className="font-work text-brand-primary-brown font-bold text-md">
                                {formatMoney(product.sale_price)}
                            </span>
                            <span className="font-sans line-through text-xs text-gray-400">
                                {formatMoney(product.price)}
                            </span>
                        </div>
                    ) : (
                        <p className="font-work text-brand-light-brown text-md truncate">{formatMoney(product.price)}</p>
                    )}
                </div>
                <div className="flex flex-row gap-2">
                    <CustomButton
                        key={"add_to_cart"}
                        variant={"solid"}
                        colorScheme={"primary"}
                        onClick={() => {
                            router.push(`/product/${product.slug}`)
                        }}
                        className="py-4 px-2 w-full  flex-1 text-sm font-normal rounded-lg "
                    >
                        View
                    </CustomButton>
                    <FavoriteButton product={product}></FavoriteButton>
                </div>
            </div>
        </div >
    )
}