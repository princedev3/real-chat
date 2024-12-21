"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { enterNewPassword } from "@/action/actions";
import FormSuccess from "@/components/form-success";
import FormError from "@/components/form-error";
import { Loader2 } from "lucide-react";

const changePasswordSchema = z.object({
  password: z.string().min(5, {
    message: "password must be at least 5 characters.",
  }),
});

const NewPasswordPage = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    setSuccess("");
    setError("");
    setLoading(true);
    const res = await enterNewPassword(values, token);
    setSuccess(res.success as string);
    setError(res.error as string);
    setLoading(false);
    form.reset();
    if (res.success) {
      router.push("/auth/login");
    }
  }
  return (
    <div className="grid place-items-center h-screen ">
      <div className="mx-auto grid w-full max-w-md shadow-lg p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Forgot password</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit" className="w-full">
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "enter new password"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
