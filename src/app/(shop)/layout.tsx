import { Navbar, Footer } from "@/modules/shared";
import { AuthModal } from "@/modules/auth";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AuthModal />
    </>
  );
}
