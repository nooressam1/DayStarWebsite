import React, { InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}


/**
 * Reusable and customizable styled text input field component with validation support.
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  required,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-brand-primary-brown font-sans text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        required={required}
        className={`rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors font-sans w-full ${error
            ? "border-red-500 focus:border-red-500"
            : "border-brand-primary-brown/20 focus:border-brand-primary-brown"
          } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-sans mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default TextInput;
