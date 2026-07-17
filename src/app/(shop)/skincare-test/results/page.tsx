import { Suspense } from "react";
import SkincareTestResultsPage from "@/modules/skincare-test/results/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function SkincareTestResults() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <SkincareTestResultsPage />
    </Suspense>
  );
}
