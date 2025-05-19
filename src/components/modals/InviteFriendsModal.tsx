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
import { useChat } from "@/contexts/ChatContext";
import { InviteCodeSchema, type InviteCodeFormValues } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Copy, Check, Users, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteFriendsModal({ isOpen, onClose }: InviteFriendsModalProps) {
  const { generateAndStoreInviteCode, connectWithInviteCode, isLoading: chatIsLoading } = useChat();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<InviteCodeFormValues>({
    resolver: zodResolver(InviteCodeSchema),
    defaultValues: { code: "" },
  });

  const handleGenerateCode = async () => {
    const code = await generateAndStoreInviteCode();
    if (code) {
      setInviteCode(code);
      setCopied(false);
      toast({ title: "Invite Code Generated", description: "Share this code with your friends." });
    } else {
      toast({ title: "Error", description: "Could not generate invite code.", variant: "destructive" });
    }
  };

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onConnectSubmit = async (data: InviteCodeFormValues) => {
    await connectWithInviteCode(data.code);
    form.reset(); 
    // Optionally close modal or give feedback
    // onClose(); // Decided to keep it open for now.
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) { setInviteCode(null); form.reset(); } onClose();}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" /> Invite Friends
          </DialogTitle>
          <DialogDescription>
            Share your unique code or enter a friend&apos;s code to connect.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h3 className="text-sm font-medium mb-2">Your Invite Code</h3>
            {inviteCode ? (
              <div className="flex items-center space-x-2">
                <Input value={inviteCode} readOnly className="font-mono"/>
                <Button variant="outline" size="icon" onClick={handleCopyCode} aria-label="Copy code">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Click below to generate your code.</p>
            )}
            <Button onClick={handleGenerateCode} disabled={chatIsLoading} className="mt-2 w-full">
              {chatIsLoading ? "Generating..." : "Generate My Code"}
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Connect with a Friend</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onConnectSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Enter Invite Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 8-digit invite code" {...field} className="font-mono"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={chatIsLoading} className="w-full">
                  {chatIsLoading ? "Connecting..." : <><LinkIcon className="mr-2 h-4 w-4" /> Connect</>}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <DialogFooter className="sm:justify-end pt-2">
          <Button variant="outline" onClick={() => { setInviteCode(null); form.reset(); onClose(); }}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
