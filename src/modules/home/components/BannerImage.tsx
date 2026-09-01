import React from 'react';
import Image from 'next/image';
import { CustomButton } from "@/modules/shared";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BannerImage() {
    return (
        <div className="w-full flex overflow-hidden justify-start items-center h-[500px] sm:h-[700px] md:h-[850px] relative">
            {/* Background Two-Image Split */}
            <div className="w-full flex overflow-hidden h-full">
                {/* Left Image */}
                <div className="w-full flex-[1] h-full relative overflow-hidden">
                    <Image
                        src="/assets/images/BannerImage3.jpg"
                        alt="Banner"
                        fill
                        sizes="(max-width: 768px) 50vw, 50vw"
                        className="object-cover w-full h-full saturate-[0.8]"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/35 z-[5]" />
                </div>

                {/* Right Image */}
                <div className="w-full flex-[1] h-full relative overflow-hidden">
                    <Image
                        src="/assets/images/BannerImage2.jpg"
                        alt="Banner"
                        fill
                        sizes="(max-width: 768px) 50vw, 50vw"
                        className="object-cover w-full h-full saturate-[0.8]"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30 z-[5]" />
                </div>
            </div>

            {/* Text Overlay: Centered across both images on smaller screens, Left-Aligned on Desktop */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center md:items-start md:text-left px-6 sm:px-12 md:pl-20 pointer-events-none">
                <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 sm:gap-6 max-w-xl md:max-w-3xl pointer-events-auto">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-serif leading-tight w-full">
                            Your Skin,
                            <br className="hidden sm:inline" />
                            {" "}Your Routine
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg font-light text-[#E7DBD7] font-sans leading-relaxed max-w-md md:max-w-none">
                            Destination for everything <br className="hidden sm:inline" />
                            that is reliable, effective and safe for your skin
                        </p>
                    </div>
                    <Link
                        href="/skincare-test"
                        className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
                    >
                        <CustomButton
                            className="px-8 py-3 text-md md:px-15 md:py-4 md:text-lg font-serif"
                            variant="opacity"
                            colorScheme="secondary"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Build Your Routine
                        </CustomButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}