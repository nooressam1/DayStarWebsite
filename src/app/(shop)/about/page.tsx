import { Suspense } from "react";
import AboutPage from "@/modules/about/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
