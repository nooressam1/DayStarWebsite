import { Suspense } from "react";
import ContactPage from "@/modules/contact/page";
import { Spinner } from "@/modules/shared/component/Spinner";

export default function Contact() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      }
    >
      <ContactPage />
    </Suspense>
  );
}
