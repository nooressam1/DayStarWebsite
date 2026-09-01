import { Navbar, Footer } from "@/modules/shared";
import { AuthModal } from "@/modules/auth";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-bg">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
    </div>
  );
}
