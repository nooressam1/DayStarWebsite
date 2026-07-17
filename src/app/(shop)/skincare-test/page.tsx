import { Suspense } from "react";
import SkincareTestPage from "@/modules/skincare-test/page";
import { Spinner } from "@/modules/shared/component/Spinner";

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
