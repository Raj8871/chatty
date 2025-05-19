"use client";

import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatProvider } from "@/contexts/ChatContext";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <AppLayout>
          <ChatInterface />
        </AppLayout>
      </ChatProvider>
    </ProtectedRoute>
  );
}
