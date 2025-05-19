"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/contexts/ChatContext";
import { MessageSchema, type MessageFormValues } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send, Paperclip, Image as ImageIcon, Video, Link2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, type ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";

export function MessageInput() {
  const { sendNewMessage, activeChatContactId, isLoading } = useChat();
  const [attachmentType, setAttachmentType] = useState<"image" | "videoLink" | "otherLink" | null>(null);
  const [attachmentValue, setAttachmentValue] = useState("");
  const { toast } = useToast();


  const form = useForm<MessageFormValues>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      text: "",
      imageUrl: "",
      videoLink: "",
      otherLink: "",
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock image upload: use a placeholder or data URL. For real app, upload to server.
      // For simplicity, we'll use a placeholder URL if an image is "selected".
      // In a real scenario, you'd get a URL after uploading.
      const placeholderImageUrl = `https://placehold.co/200x150.png?text=Image`;
      form.setValue("imageUrl", placeholderImageUrl);
      setAttachmentType(null); // Close popover or clear indicator
      toast({ title: "Image Selected (Mock)", description: "A placeholder image URL has been set." });
    }
     event.target.value = ''; // Reset file input
  };

  const handleAddLink = () => {
    if (attachmentType && attachmentValue) {
      if (!attachmentValue.startsWith('http://') && !attachmentValue.startsWith('https://')) {
        toast({ title: "Invalid URL", description: "Please enter a valid URL starting with http:// or https://", variant: "destructive" });
        return;
      }
      form.setValue(attachmentType, attachmentValue);
      toast({ title: `${attachmentType.replace('Link', ' Link')} Added`, description: "The link has been added to your message." });
    }
    setAttachmentType(null);
    setAttachmentValue("");
  };


  const onSubmit = async (data: MessageFormValues) => {
    if (!activeChatContactId) {
      toast({ title: "No Chat Selected", description: "Please select a contact to send a message.", variant: "destructive" });
      return;
    }
    await sendNewMessage({
      messageText: data.text,
      imageUrl: data.imageUrl,
      videoLink: data.videoLink,
      otherLink: data.otherLink,
      receiverId: activeChatContactId, // This is set correctly in sendNewMessage
    });
    form.reset();
    form.setValue("imageUrl", ""); // Clear any set links
    form.setValue("videoLink", "");
    form.setValue("otherLink", "");
  };

  const isFormEmpty = !form.watch("text") && !form.watch("imageUrl") && !form.watch("videoLink") && !form.watch("otherLink");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="sticky bottom-0 border-t bg-card p-4"
      >
        {(form.watch("imageUrl") || form.watch("videoLink") || form.watch("otherLink")) && (
          <div className="mb-2 p-2 border rounded-md bg-muted/50 text-xs text-muted-foreground">
            {form.watch("imageUrl") && <p>Image attached: {form.watch("imageUrl")?.substring(0,30)}...</p>}
            {form.watch("videoLink") && <p>Video link: {form.watch("videoLink")?.substring(0,30)}...</p>}
            {form.watch("otherLink") && <p>Link: {form.watch("otherLink")?.substring(0,30)}...</p>}
            <Button variant="link" size="sm" className="p-0 h-auto text-destructive" onClick={() => {
                 form.setValue("imageUrl", ""); 
                 form.setValue("videoLink", "");
                 form.setValue("otherLink", "");
            }}>Clear attachments</Button>
          </div>
        )}
        <div className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[40px] resize-none"
                    rows={1}
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if(!isFormEmpty) form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Popover onOpenChange={(open) => { if (!open) { setAttachmentType(null); setAttachmentValue(""); } }}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" type="button" aria-label="Attach file" disabled={!activeChatContactId || isLoading}>
                <Paperclip className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 space-y-2">
                {attachmentType ? (
                  <>
                    <Label htmlFor="attachmentInput" className="capitalize">{attachmentType.replace('Link', ' Link')}</Label>
                    <Input 
                      id="attachmentInput" 
                      value={attachmentValue} 
                      onChange={(e) => setAttachmentValue(e.target.value)}
                      placeholder={`Enter ${attachmentType.replace('Link', ' Link')} URL`}
                    />
                    <div className="flex justify-end space-x-2">
                       <Button variant="ghost" size="sm" onClick={() => setAttachmentType(null)}>Cancel</Button>
                       <Button size="sm" onClick={handleAddLink}>Add</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => document.getElementById('imageUploadInput')?.click()}>
                      <ImageIcon className="mr-2 h-4 w-4" /> Image
                    </Button>
                    <input type="file" id="imageUploadInput" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setAttachmentType("videoLink")}>
                      <Video className="mr-2 h-4 w-4" /> Video Link
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setAttachmentType("otherLink")}>
                      <Link2 className="mr-2 h-4 w-4" /> Other Link
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button type="submit" size="icon" aria-label="Send message" disabled={!activeChatContactId || isLoading || isFormEmpty}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
