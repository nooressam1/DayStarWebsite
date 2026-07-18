import { Suspense } from "react";
import { HomePage } from "@/modules/home";
import { Spinner } from "@/modules/shared";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
