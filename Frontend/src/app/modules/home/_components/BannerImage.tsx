import React from 'react'
import Image from 'next/image'
import CustomButton from '../../shared/component/CustomButton'
import Link from 'next/link'

export default function BannerImage() {
    return (
        <div className='w-full flex overflow-hidden justify-start items-center h-[500px] sm:h-[700px] md:h-[950px] relative'>
            <Image
                src="/assets/images/BannerImage.jpg"
                alt="Banner"
                fill
                sizes="100vw"
                className="object-cover w-full h-full"
                priority
            />
            <div className='relative px-6 sm:px-12 md:pl-20 h-fit z-10 flex flex-col items-start justify-center gap-4 sm:gap-6 max-w-xl md:max-w-3xl'>
                <h1 className='text-xl sm:text-3xl md:text-4xl font-light text-white font-sans leading-tight'>
                    Destination for everything <br className="hidden sm:inline" />
                    that is reliable, effective and safe <br className="hidden sm:inline" /> for your skin
                </h1>
                <Link
                    href="/product"
                    className="cursor-pointer font-serif text-brand-primary-brown font-medium text-base hover:opacity-80 transition-opacity"
                >
                    <CustomButton
                        className='px-8 py-3 text-lg md:px-15 md:py-4 md:text-2xl font-serif'
                        variant='opacity'
                        colorScheme='secondary'
                    >
                        Shop Now
                    </CustomButton>
                </Link>
            </div>
        </div >
    )
}