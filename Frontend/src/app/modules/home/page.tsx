import { getBestSellers, getCategories } from "@/utils/services";
import Link from "next/link";
import BannerImage from "./_components/BannerImage";
import { CategoriesBox } from "./_components/CategoriesBox";
import { ProductCard } from "./_components/ProductCard";
import { SkincareBanner } from "./_components/SkincareBanner";
import { SaleBanner } from "./_components/SaleBanner";
import { ProductCarousel } from "./_components/ProductCarousel";

export default async function HomePage() {
    const categories = await getCategories();
    const bestSellers = await getBestSellers();
    return (
        <div className="flex flex-col gap-12 md:gap-25">
            <BannerImage></BannerImage>
            <div className="flex flex-col gap-12 md:gap-20">
                {/* Popular Categories */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">
                            Popular Categories </h1>
                        <h1 className="text-brand-primary-brown/70 font-light font-sans text-base md:text-lg">
                            Everything you need to care for &amp; more  </h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8  justify-center gap-5 px-10 md:px-0 md:gap-0">
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/product?category=${cat.id}`} className="cursor-pointer">
                                <CategoriesBox photo={cat.photo} categoryName={cat.name} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-8 md:gap-12 items-start px-10 sm:px-10 md:px-15">
                    {/* Best Selling Products */}
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">Best Selling Products</h1>
                            <Link href="/product?collection=best-sellers">
                                <h1 className="text-brand-primary-brown/70 font-regular font-sans text-sm md:text-md cursor-pointer hover:underline">View More</h1>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                            {bestSellers.slice(0, 4).map((product, index) => (
                                <div
                                    key={product.id}
                                    className={index === 2 ? "hidden md:block" : index === 3 ? "hidden lg:block" : ""}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skincare Banner */}
                    <SkincareBanner></SkincareBanner>
                    <div className="flex flex-col gap-5 items-start w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <h1 className="text-brand-primary-brown font-bold font-serif text-2xl md:text-3xl">Best Selling Products</h1>
                            <Link href="/product?collection=best-sellers">
                                <h1 className="text-brand-primary-brown/70 font-regular font-sans text-sm md:text-md cursor-pointer hover:underline">View More</h1>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
                            {bestSellers.slice(0, 4).map((product, index) => (
                                <div
                                    key={product.id}
                                    className={index === 2 ? "hidden md:block" : index === 3 ? "hidden lg:block" : ""}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Sale Banner + Product Carousel side by side */}
                    <div className="flex flex-col md:flex-row gap-5 w-full items-stretch">
                        <div className="flex flex-[4] w-full min-h-[350px] md:min-h-0">
                            <SaleBanner />
                        </div>
                        <div className="flex flex-[2] w-full">
                            <ProductCarousel products={bestSellers} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

