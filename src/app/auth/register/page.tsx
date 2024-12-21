"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createUser } from "@/action/actions";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(5, {
    message: "password must be at least 5 characters.",
  }),
});

const Register = () => {
  const searchParams = useSearchParams();
  const getInviteToken = searchParams.get("token") as string;
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    setSuccess("");
    const response = await createUser({
      ...values,
      token: getInviteToken as string,
    });
    setError(response?.error);
    setSuccess(response?.success);
    setLoading(false);
  }
  return (
    <div className="grid place-items-center h-screen ">
      <div className="grid w-full max-w-md mx-auto  shadow-sm p-6 rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Real-time Chat</h1>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="enter your name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="enter your email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="enter your password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="w-full text-center"
                type="submit"
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin text-center" />
                ) : (
                  "Register"
                )}
              </Button>
              <FormError message={error as string} />
              <FormSuccess message={success as string} />
            </form>
          </Form>
          <div className="text-center my-3">
            <Link
              href={"/auth/login"}
              className="text-muted-foreground   text-sm underline cursor-pointer "
            >
              have and account?login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
