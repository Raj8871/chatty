
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { LoginSchema, type LoginFormValues } from "@/lib/schema";
import { useAuth } from "@/contexts/AuthContext";
import { Key }
from 'lucide-react';
import Link from "next/link";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      passKey: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.passKey);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="passKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Key className="mr-2 h-4 w-4 text-muted-foreground" /> Pass Key
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your 6-8 digit passkey" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>
        <p>
          <Link href="/recover-passkey" className="font-medium text-primary hover:underline">
            Forgot your pass key?
          </Link>
        </p>
      </div>
    </Form>
  );
}
