import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter, Work_Sans, Libre_Baskerville } from "next/font/google";
import { getCachedUser } from "@/lib/supabase/server-auth";
import { AuthProvider } from "@/lib/supabase/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// 2. Configure Work Sans (Note the underscore in the import name!)
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

// 3. Configure Libre Baskerville (Serif fonts usually require a weight definition)
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
});

export const metadata: Metadata = {
  title: "DayStar",
  description: "DayStar ecommerce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getCachedUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${workSans.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="font-sans antialiased">
        <AuthProvider initialUser={initialUser}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
