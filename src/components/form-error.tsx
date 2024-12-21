"use client";
import { AlertTriangle } from "lucide-react";
import React from "react";

const FormError = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 dark:bg-transparent border-red-800 dark:border p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <AlertTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
