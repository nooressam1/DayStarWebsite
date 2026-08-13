import React, { useReducer } from "react";
import { useContactMutation } from "@/app/api/hooks/useContactQueries";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormFullState {
  formData: ContactFormData;
  errors: ContactFormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
}

const initialContactFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const initialContactFormErrors: ContactFormErrors = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type ContactFormAction =
  | { type: "CHANGE_INPUT"; name: keyof ContactFormData; value: string }
  | { type: "SET_ERRORS"; errors: ContactFormErrors }
  | { type: "CLEAR_ERROR"; field: keyof ContactFormErrors }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE" }
  | { type: "RESET_SUCCESS" };

function contactFormReducer(
  state: ContactFormFullState,
  action: ContactFormAction
): ContactFormFullState {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        formData: { ...state.formData, [action.name]: action.value },
        errors: state.errors[action.name]
          ? { ...state.errors, [action.name]: "" }
          : state.errors,
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "CLEAR_ERROR":
      return { ...state, errors: { ...state.errors, [action.field]: "" } };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        isSuccess: true,
        formData: initialContactFormData,
        errors: initialContactFormErrors,
      };
    case "SUBMIT_FAILURE":
      return { ...state, isSubmitting: false };
    case "RESET_SUCCESS":
      return { ...state, isSuccess: false };
    default:
      return state;
  }
}

export function useContactForm() {
  const [state, dispatch] = useReducer(contactFormReducer, {
    formData: initialContactFormData,
    errors: initialContactFormErrors,
    isSubmitting: false,
    isSuccess: false,
  });

  const contactMutation = useContactMutation();

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", subject: "", message: "" };

    if (!state.formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    if (!state.formData.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!state.formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!state.formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (state.formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
      isValid = false;
    }

    if (!isValid) {
      dispatch({ type: "SET_ERRORS", errors: newErrors });
    }
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "CHANGE_INPUT",
      name: name as keyof ContactFormData,
      value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch({ type: "SUBMIT_START" });

    try {
      await contactMutation.mutateAsync(state.formData);
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (error) {
      console.error("Submission failed", error);
      dispatch({ type: "SUBMIT_FAILURE" });
    }
  };

  const resetForm = () => {
    dispatch({ type: "RESET_SUCCESS" });
  };

  return {
    formData: state.formData,
    errors: state.errors,
    isSubmitting: state.isSubmitting || contactMutation.isPending,
    isSuccess: state.isSuccess,
    handleInputChange,
    handleSubmit,
    resetForm,
    dispatch,
  };
}

