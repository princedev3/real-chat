"use client";
import { useSessionStore } from "@/store/session-provider";
import { Session } from "next-auth";
import React, { useEffect } from "react";

const SessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const setSession = useSessionStore((state) => state.setSession);
  useEffect(() => {
    setSession(session);
  }, [setSession, session]);
  return <div>{children}</div>;
};

export default SessionProvider;
