import { Suspense } from "react";
import { SkincareTestPage } from "@/modules/skincare-test";
import { Spinner } from "@/modules/shared";

export default function SkincareTest() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <SkincareTestPage />
    </Suspense>
  );
}
