"use client";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import CustomButton from "../../shared/component/CustomButton";
import FavoriteButton from "../../shared/component/FavoriteButton";
import { Product } from "@/utils/types/type";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-2 w-full h-full border border-brand-primary-brown/10 rounded-lg">
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] ">
                <Image fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover rounded-lg" src={product.images[0]} alt={product.name} />
            </div>
            <div className="p-4 flex flex-col gap-5">
                <div className="flex flex-col ">
                    <h1 className="font-serif text-black text-lg truncate">{product.name}</h1>
                    <p className="font-work text-brand-light-brown text-md truncate">{formatMoney(product.price)}</p>
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
                    <FavoriteButton productId={product.id}></FavoriteButton>
                </div>
            </div>
        </div >
    )
}