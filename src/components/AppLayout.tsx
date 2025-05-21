import type React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
