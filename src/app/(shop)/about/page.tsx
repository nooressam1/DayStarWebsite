import { Suspense } from "react";
import { AboutPage, AboutPageSkeleton } from "@/modules/about";

export default function About() {
  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPage />
    </Suspense>
  );
}
