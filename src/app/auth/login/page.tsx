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
import { loginUser } from "@/action/actions";
import { Loader2 } from "lucide-react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

const Login = () => {
  const loginSchema = z.object({
    email: z.string().email({
      message: "Email is requred",
    }),
    password: z.string().min(5, {
      message: "password must be at least 5 characters.",
    }),
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("");
    setSuccess("");
    setLoading(true);
    const response = await loginUser(values);
    if (response.success) {
      window.location.href = "/";
    }
    setError(response.error);
    setSuccess(response.success);
    setLoading(false);
  }
  return (
    <div className="grid place-items-center h-screen">
      <div className="grid w-full max-w-md mx-auto  shadow-md p-6 rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">Real-time Chat</h1>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        id="email"
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
                        id="password"
                        placeholder="enter your password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link
                href={"/auth/forgot-password"}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Forgot password?
              </Link>
              <Button className="w-full" type="submit">
                {loading ? (
                  <Loader2 className="size-5 animate-spin text-center" />
                ) : (
                  "Login"
                )}
              </Button>
              <div className="flex flex-col mb-4">
                <FormError message={error as string} />
                <FormSuccess message={success as string} />
              </div>
            </form>
          </Form>
          <div className="text-center my-3">
            <Link
              href={"/auth/register"}
              className="text-muted-foreground   text-sm underline cursor-pointer "
            >
              dont have an account?register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
