"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createInvitation } from "@/action/actions";
import { useSessionStore } from "@/store/session-provider";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const formSchema = z.object({
  email: z.string().email(),
});

const AvailableUser = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const session = useSessionStore((state) => state.session);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    setSuccess("");
    const res = await createInvitation(Number(session?.user?.id), values.email);
    setSuccess(res?.success as string);
    setError(res?.error as string);
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  }
  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">
        Invite a friend and start chatting!
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={success as string} />
          <FormError message={error as string} />
          <Button type="submit">Invite a friend</Button>
        </form>
      </Form>
    </div>
  );
};

export default AvailableUser;
