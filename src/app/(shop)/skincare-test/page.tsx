import { Suspense } from "react";
import { SkincareTestPage, SkincareTestSkeleton } from "@/modules/skincare-test";

export default function SkincareTest() {
  return (
    <Suspense fallback={<SkincareTestSkeleton />}>
      <SkincareTestPage />
    </Suspense>
  );
}
