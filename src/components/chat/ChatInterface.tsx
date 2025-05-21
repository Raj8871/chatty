"use client";

import { ContactList } from "./ContactList";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";
import { Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";

export function ChatInterface() {
  return (
    // The SidebarProvider is in AppLayout.tsx
    // Sidebar component handles responsiveness: off-canvas on mobile, collapsible on desktop.
    <>
      <Sidebar side="left" collapsible="icon" className="h-full">
        <SidebarContent>
          <ContactList />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <MessageArea />
          <MessageInput />
        </div>
      </SidebarInset>
    </>
  );
}
