import { Suspense } from "react";
import HomePage from "@/modules/home/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
