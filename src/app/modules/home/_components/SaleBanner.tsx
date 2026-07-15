import Image from "next/image";
import Link from "next/link";
import CustomButton from "../../shared/component/CustomButton";

export function SaleBanner() {
    return (
        <div className='w-full rounded-md flex overflow-hidden justify-center items-center h-[300px] sm:h-[400px] md:h-full min-h-[300px] sm:min-h-[400px] md:min-h-0 relative'>
            <Image
                src="/assets/images/SaleImage.jpg"
                alt="Banner"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover w-full h-full"
                priority
            />
            <div className="absolute inset-0 bg-black/40 z-5" />

            <div className='relative px-6 sm:px-12 md:pl-20 pt-6 md:pt-15 h-fit w-full z-10 flex flex-col items-start justify-center gap-2 sm:gap-3'>
                <h1 className='text-4xl sm:text-7xl md:text-8xl font-bold text-white font-serif leading-none'>
                    50% <br />
                    OFF
                </h1>
                <h1 className='text-xs sm:text-sm md:text-lg font-light text-white font-sans max-w-xs sm:max-w-md'>
                    Choose from our selection of beauty care products
                </h1>
                <Link href="/product?collection=sale&discount=50">
                    <CustomButton 
                        className='px-6 py-2.5 text-lg sm:px-15 sm:py-4 sm:text-2xl font-serif mt-2' 
                        variant='opacity' 
                        colorScheme='secondary'
                    >
                        Buy Now
                    </CustomButton>
                </Link>
            </div>
        </div >
    )
}