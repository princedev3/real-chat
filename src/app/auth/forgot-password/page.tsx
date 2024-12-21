"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormSuccess from "@/components/form-success";
import { useState } from "react";
import { reset } from "@/action/actions";
import FormError from "@/components/form-error";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email format").min(5).max(50),
});

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSuccess("");
    setError("");
    setLoading(true);
    const res = await reset(values);
    setSuccess(res.success as string);
    setError(res.error as string);
    setLoading(false);
    form.reset();
  }
  return (
    <div className="grid place-items-center h-screen ">
      <div className="mx-auto grid w-full max-w-md shadow-lg p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Forgot password</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button className="w-full" type="submit">
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Send reset email"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
