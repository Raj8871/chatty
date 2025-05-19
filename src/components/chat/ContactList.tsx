"use client";

import { useChat } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { User, Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function ContactList() {
  const { contacts, activeChatContactId, setActiveChatContactId, isLoading } = useChat();

  if (isLoading && contacts.length === 0) {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-2 flex items-center"><Users className="mr-2 h-5 w-5" /> Contacts</h2>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold tracking-tight flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" /> Contacts
        </h2>
        {contacts.length === 0 && !isLoading ? (
          <p className="text-sm text-muted-foreground">No contacts yet. Invite friends to start chatting!</p>
        ) : (
          <div className="space-y-1">
            {contacts.map((contact) => (
              <button
                key={contact.userId}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  activeChatContactId === contact.userId && "bg-accent text-accent-foreground font-medium"
                )}
                onClick={() => setActiveChatContactId(contact.userId)}
              >
                <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-accent-foreground data-[active=true]:border-primary">
                  <AvatarImage src={contact.profilePhotoUrl || undefined} alt={contact.userName} data-ai-hint="profile avatar" />
                  <AvatarFallback>
                    {contact.userName ? contact.userName[0].toUpperCase() : <User size={18}/>}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="truncate font-medium">{contact.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {/* Placeholder for last message or status */}
                    Click to chat
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
