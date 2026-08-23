import { Suspense } from "react";
import { SkincareTestResultsPage, SkincareTestResultsSkeleton } from "@/modules/skincare-test";

export default function SkincareTestResults() {
  return (
    <Suspense fallback={<SkincareTestResultsSkeleton />}>
      <SkincareTestResultsPage />
    </Suspense>
  );
}
