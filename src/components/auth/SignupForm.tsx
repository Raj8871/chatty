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
import { SignupSchema, type SignupFormValues } from "@/lib/schema";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, HelpCircle, Key } from "lucide-react";
import Link from "next/link";

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      question1: "",
      question2: "",
      question3: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    await signup(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
              </FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Security Question 1
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Your mother's maiden name?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Security Question 2
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Your first pet's name?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question3"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Security Question 3
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., City you were born in?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : <> <Key className="mr-2 h-4 w-4" /> Create Pass Key </>}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </Form>
  );
}
