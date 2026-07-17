import { Suspense } from "react";
import { AboutPage } from "@/modules/about";
import { Spinner } from "@/modules/shared";

export default function About() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <AboutPage />
    </Suspense>
  );
}
