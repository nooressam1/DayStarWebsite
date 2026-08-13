"use client";

import { useMutation } from "@tanstack/react-query";
import { createContactSubmission } from "@/app/api/endpoints/contact.endpoint";

export function useContactMutation() {
  return useMutation({
    mutationFn: (formData: { name: string; email: string; subject: string; message: string }) =>
      createContactSubmission(formData),
  });
}
