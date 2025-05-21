
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
import { RecoverPasskeySchema, type RecoverPasskeyFormValues } from "@/lib/schema";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, HelpCircle, Key, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function RecoverPasskeyForm() {
  const { recoverPasskey, isLoading } = useAuth();
  const [recoveredPasskey, setRecoveredPasskey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<RecoverPasskeyFormValues>({
    resolver: zodResolver(RecoverPasskeySchema),
    defaultValues: {
      email: "",
      answer1: "",
      answer2: "",
      answer3: "",
    },
  });

  const onSubmit = async (data: RecoverPasskeyFormValues) => {
    setRecoveredPasskey(null); // Reset on new submission
    setCopied(false);
    const passkey = await recoverPasskey(data);
    if (passkey) {
      setRecoveredPasskey(passkey);
    }
  };

  const handleCopyPasskey = () => {
    if (recoveredPasskey) {
      navigator.clipboard.writeText(recoveredPasskey);
      setCopied(true);
      toast({ title: "Copied!", description: "Pass Key copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {!recoveredPasskey ? (
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
              name="answer1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Security Answer 1
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your answer for security question 1" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Security Answer 2
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your answer for security question 2" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Security Answer 3
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your answer for security question 3" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Recovering..." : "Recover Pass Key"}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <Alert variant="default">
            <Key className="h-5 w-5" />
            <AlertTitle>Pass Key Recovered!</AlertTitle>
            <AlertDescription>
              Your Pass Key is:
              <div className="my-2 flex items-center gap-2 rounded-md border bg-muted p-3">
                <span className="font-mono text-lg text-foreground break-all">{recoveredPasskey}</span>
                <Button variant="ghost" size="icon" onClick={handleCopyPasskey} aria-label="Copy pass key">
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              Please copy it and store it securely. You can now use it to log in.
            </AlertDescription>
          </Alert>
          <Button onClick={() => { setRecoveredPasskey(null); form.reset(); }} className="w-full" variant="outline">
            Try Again or Recover Another
          </Button>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your Pass Key?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
