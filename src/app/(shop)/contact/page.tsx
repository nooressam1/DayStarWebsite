import { Suspense } from "react";
import { ContactPage, ContactPageSkeleton } from "@/modules/contact";

// Pre-render statically and revalidate cache every hour
export const revalidate = 3600;

export default function Contact() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPage />
    </Suspense>
  );
}
