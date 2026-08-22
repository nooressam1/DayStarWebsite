import { Suspense } from "react";
import { AboutPage, AboutPageSkeleton } from "@/modules/about";

// Pre-render statically and revalidate cache every hour
export const revalidate = 3600;

export default function About() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPage />
    </Suspense>
  );
}
