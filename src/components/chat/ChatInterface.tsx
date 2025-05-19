"use client";

import { ContactList } from "./ContactList";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";
import { Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar"; // Using ShadCN Sidebar

export function ChatInterface() {
  return (
    // Using Shadcn Sidebar component. It handles its own state by default.
    // The 'collapsible="icon"' or "offcanvas" options can be used for responsiveness.
    // For a simple two-column layout, we can use flexbox or grid directly.
    // Let's use a flex layout for simplicity as SidebarProvider and its controls might be overkill
    // if not fully configured. Or use the Shadcn Sidebar for a more robust solution.

    // Option 1: Simple Flex Layout
    <div className="flex h-[calc(100vh-4rem)]"> {/* 4rem is approx header height */}
      <aside className="w-1/4 min-w-[280px] max-w-[350px] border-r bg-card">
        <ContactList />
      </aside>
      <section className="flex flex-1 flex-col">
        <MessageArea />
        <MessageInput />
      </section>
    </div>
  );
}
