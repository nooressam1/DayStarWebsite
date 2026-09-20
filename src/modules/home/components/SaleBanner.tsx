import Image from "next/image";
import Link from "next/link";
import { CustomButton } from "@/modules/shared";

export function SaleBanner({ hasDiscountProducts = true }: { hasDiscountProducts?: boolean }) {
    return (
        <div className="w-full rounded-lg flex overflow-hidden justify-center items-center h-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[420px] relative min-w-0">
            <Image
                src="/assets/images/SaleImage.jpg"
                alt="Banner"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover w-full h-full"
                priority
            />
            <div className="absolute inset-0 bg-black/40 z-5" />

            <div className="relative px-6 py-8 sm:px-10 sm:py-10 md:px-12 lg:px-10 xl:px-14 h-full w-full z-10 flex flex-col items-start justify-center gap-2 sm:gap-3 min-w-0">
                {hasDiscountProducts ? (
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-serif leading-tight">
                        50% <br />
                        OFF
                    </h1>
                ) : (
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-serif leading-tight">
                        Sale <br />
                        Offers
                    </h1>
                )}
                <p className="text-xs sm:text-sm md:text-base font-light text-white/90 font-sans max-w-xs sm:max-w-md">
                    Choose from our selection of beauty care products
                </p>
                <Link href={hasDiscountProducts ? "/product?collection=sale&discount=50" : "/product?collection=sale"}>
                    <CustomButton
                        className="px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-serif mt-2 rounded-lg"
                        variant="opacity"
                        colorScheme="secondary"
                    >
                        Shop Now
                    </CustomButton>
                </Link>
            </div>
        </div>
    );
}