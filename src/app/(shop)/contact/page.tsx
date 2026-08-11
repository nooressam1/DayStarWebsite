import { Suspense } from "react";
import { ContactPage, ContactPageSkeleton } from "@/modules/contact";

export default function Contact() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPage />
    </Suspense>
  );
}
