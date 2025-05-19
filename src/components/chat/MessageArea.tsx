"use client";

import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { User, ExternalLink, Film, Paperclip } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";

export function MessageArea() {
  const { messages, activeChatContactId, contacts, isLoading: chatLoading } = useChat();
  const { user, isLoading: authLoading } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  const activeContact = contacts.find(c => c.userId === activeChatContactId);

  if (authLoading || (chatLoading && messages.length === 0 && activeChatContactId)) {
     return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex items-end space-x-2 ${i % 2 === 0 ? '' : 'justify-end'}`}>
            {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            <Skeleton className={`h-10 rounded-lg ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'}`} />
            {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
          </div>
        ))}
      </div>
    );
  }

  if (!activeChatContactId || !user) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <User className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">Select a contact to start chatting</p>
        <p className="text-sm text-muted-foreground">Or, invite new friends to connect!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((msg) => {
          const isSender = msg.senderId === user.id;
          const senderUser = isSender ? user : activeContact;
          const getInitials = (name: string | undefined) => name ? name[0].toUpperCase() : "U";

          return (
            <div
              key={msg.id}
              className={cn("flex items-end gap-2", isSender ? "justify-end" : "")}
            >
              {!isSender && (
                <Avatar className="h-8 w-8 self-start border">
                  <AvatarImage src={senderUser?.profilePhotoUrl} alt={senderUser?.userName || 'User'} data-ai-hint="profile avatar" />
                  <AvatarFallback>{getInitials(senderUser?.userName)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3 shadow-sm",
                  isSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                )}
              >
                {msg.messageText && <p className="text-sm whitespace-pre-wrap break-words">{msg.messageText}</p>}
                {msg.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={msg.imageUrl}
                      alt="Shared image"
                      width={200}
                      height={150}
                      className="rounded-md object-cover"
                      data-ai-hint="chat image"
                    />
                  </div>
                )}
                {msg.videoLink && (
                  <a
                    href={msg.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center text-sm hover:underline"
                  >
                    <Film className="mr-1 h-4 w-4" /> Video Link <ExternalLink className="ml-1 h-3 w-3"/>
                  </a>
                )}
                {msg.otherLink && (
                   <a
                    href={msg.otherLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center text-sm hover:underline"
                  >
                    <Paperclip className="mr-1 h-4 w-4" /> Link <ExternalLink className="ml-1 h-3 w-3"/>
                  </a>
                )}
                <p className={cn(
                    "mt-1 text-xs",
                    isSender ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                  )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {isSender && (
                <Avatar className="h-8 w-8 self-start border">
                  <AvatarImage src={senderUser?.profilePhotoUrl} alt={senderUser?.email || 'User'} data-ai-hint="profile avatar" />
                  <AvatarFallback>{getInitials(senderUser?.email)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
