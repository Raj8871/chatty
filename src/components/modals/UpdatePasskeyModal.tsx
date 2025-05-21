"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { UpdatePasskeySchema, type UpdatePasskeyFormValues } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import { useState } from "react"; // Added useState import

interface UpdatePasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdatePasskeyModal({ isOpen, onClose }: UpdatePasskeyModalProps) {
  const { user, updateUserPassKey, isLoading } = useAuth();

  const form = useForm<UpdatePasskeyFormValues>({
    resolver: zodResolver(UpdatePasskeySchema),
    defaultValues: {
      question1: user?.question1 || "",
      question2: user?.question2 || "",
      question3: user?.question3 || "",
    },
  });
  
  // Reset form if user changes or modal opens
  useState(() => {
    if (user && isOpen) {
      form.reset({
        question1: user.question1,
        question2: user.question2,
        question3: user.question3,
      });
    }
  });


  const onSubmit = async (data: UpdatePasskeyFormValues) => {
    await updateUserPassKey(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Pass Key</DialogTitle>
          <DialogDescription>
            Reset your security questions. A new pass key will be generated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Confirm & Generate New Pass Key"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
