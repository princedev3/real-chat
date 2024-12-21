"use client";
import { verifyInvitation } from "@/action/actions";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

const InvitationPage = () => {
  const [error, setError] = useState<string | undefined>();
  const [succes, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const router = useRouter();
  const inviteCheck = useCallback(async () => {
    if (!token) {
      setError("Missing token");
      return;
    }
    const res = await verifyInvitation(token);

    if (res.success) {
      setSuccess("Invitation verified");
      router.push(`/auth/register?token=${token}`);
    }
  }, [token]);
  useEffect(() => {
    inviteCheck();
  }, [token]);
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-center">
        Kindly wait while we verify your invitation
      </h1>
      <div className="w-full flex items-center justify-center">
        {!error && !succes && <BounceLoader size={100} color="#1E3A8A" />}
        <FormError message={error as string} />
        <FormSuccess message={succes as string} />
      </div>
    </div>
  );
};

export default InvitationPage;
