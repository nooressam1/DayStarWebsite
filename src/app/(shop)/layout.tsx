import Navbar from "@/modules/shared/component/NavBar";
import { Footer } from "@/modules/shared/component/Footer";
import AuthModal from "@/modules/auth/components/AuthModal";

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
