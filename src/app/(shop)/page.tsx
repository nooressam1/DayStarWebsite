import { Suspense } from "react";
import { HomePage, HomePageSkeleton } from "@/modules/home";

export default function Home() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePage />
    </Suspense>
  );
}
