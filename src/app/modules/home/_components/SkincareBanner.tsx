import Image from "next/image";
import Link from "next/link";
import CustomButton from "../../shared/component/CustomButton";

export function SkincareBanner() {
    return (
        <div className='w-full rounded-md flex overflow-hidden justify-start items-center h-[250px] sm:h-[300px] md:h-[350px] relative'>
            <Image
                src="/assets/images/SkinCareBanner.jpg"
                alt="Banner"
                fill
                sizes="100vw"
                className="object-cover w-full h-full"
                priority
            />
            <div className="absolute inset-0 bg-black/40 z-5" />

            <div className='relative px-6 sm:px-12 md:pl-20 h-fit w-full z-10 flex flex-col items-start justify-center gap-2 sm:gap-3'>
                <h1 className='text-2xl sm:text-4xl md:text-5xl font-bold text-white font-serif leading-tight'>
                    Skincare <br />
                    Routine Quiz
                </h1>
                <h1 className='text-xs sm:text-sm md:text-md font-light text-white font-sans max-w-xs sm:max-w-md'>
                    Get a skincare routine that fits your skin type
                </h1>
                <Link href="/modules/skincare-test">
                    <CustomButton
                        className='px-6 py-2.5 text-xl sm:px-15 sm:py-4  font-serif mt-2'
                        variant='opacity'
                        colorScheme='secondary'
                    >
                        Try Now
                    </CustomButton>
                </Link>
            </div>
        </div >
    )
}