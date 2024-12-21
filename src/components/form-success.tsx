import React from "react";
import { CheckCircle } from "lucide-react";

const FormSuccess = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 dark:bg-transparent border-green-700 dark:border p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircle />
      <p className="">{message} </p>
    </div>
  );
};

export default FormSuccess;
