import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full mt-40 bg-brand-bg border-t bg-brand-primary-brown/10 border-brand-primary-brown/10 px-6 md:px-15 pt-16 flex flex-col justify-between gap-10">
            <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-5">
                {/* Left — Brand + Newsletter */}
                <div className="flex flex-col w-full md:w-auto gap-6 items-center md:items-start max-w-md">
                    <div className="flex flex-col gap-1 text-center md:text-left">
                        <h2 className="font-serif font-bold text-2xl tracking-widest text-brand-primary-brown">
                            DAYSTAR
                        </h2>
                        <p className="text-brand-light-brown font-sans text-sm">
                            Subscribe to the newsletter
                        </p>
                    </div>
                    <div className="flex w-full sm:w-3/4 md:w-full items-center border border-brand-primary-brown/30 rounded-full px-5 py-3 gap-3 bg-transparent">
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            className="flex w-full bg-transparent text-sm text-brand-light-brown placeholder:text-brand-light-brown/60 outline-none font-sans"
                        />
                        <button className="text-brand-primary-brown hover:opacity-70 transition-opacity cursor-pointer">
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Right side links wrapper */}
                <div className="flex flex-col sm:flex-row gap-10 md:gap-16 justify-center md:justify-end flex-1">
                    {/* Middle — Help Links */}
                    <div className="flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
                        <h3 className="font-serif font-semibold text-xl text-brand-primary-brown">
                            Help
                        </h3>
                        <nav className="flex flex-col gap-3">
                            {[
                                { label: "FAQ", href: "/faq" },
                                { label: "Terms and Conditions", href: "/terms" },
                                { label: "Support", href: "/support" },
                                { label: "Use and Privacy Policy", href: "/privacy" },
                                { label: "About Us", href: "/about" },
                                { label: "Return and Exchange Policy", href: "/returns" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-brand-light-brown font-work text-sm hover:text-brand-primary-brown transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right — Contact */}
                    <div className="flex flex-col gap-4 text-center sm:text-left items-center sm:items-start">
                        <h3 className="font-serif font-semibold text-xl text-brand-primary-brown">
                            Contact us
                        </h3>
                        <div className="flex flex-col gap-3 items-center sm:items-start">
                            <a
                                href="https://wa.me/966551998064"
                                className="flex items-center gap-2 text-brand-light-brown font-work text-sm hover:text-brand-primary-brown transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                +966551998064
                            </a>
                            <a
                                href="tel:+966551998064"
                                className="flex items-center gap-2 text-brand-light-brown font-work text-sm hover:text-brand-primary-brown transition-colors"
                            >
                                <Phone size={18} />
                                +966551998064
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom bar */}
            <div className="py-4 border-t border-brand-primary-brown/10 text-center">
                <p className="text-brand-light-brown/60 font-sans text-xs">
                    © {new Date().getFullYear()} Daystar. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
