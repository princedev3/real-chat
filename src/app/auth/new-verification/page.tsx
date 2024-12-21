"use client";
import { newVerificationToken } from "@/action/token";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token") || "";

  const onClick = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (!token) {
      setError("Missing token");
      return;
    }
    const response = await newVerificationToken(token);
    setError(response.error as string);
    setSuccess(response.success as string);
    setLoading(false);
    if (!response.error && response.success) {
      window.location.href = "/auth/login";
    }
  }, [token]);

  useEffect(() => {
    onClick();
  }, [token, onClick]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full grid place-content-center items-center rounded-xl justify-center max-w-2xl p-4  shadow-md  mx-auto">
        <h1 className="text-xl font-semibold text-blue-950 mb-3">
          Confirming your information
        </h1>
        <div className="text-center  flex justify-center items-centermb-5">
          {!error && !success && <DotLoader color="#1E3A8A" />}
        </div>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </div>
  );
};

export default VerificationPage;
