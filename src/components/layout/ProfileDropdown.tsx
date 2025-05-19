"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings, Users, PlusCircle, Moon, Sun, Bell, UserMinus, HelpCircle, Trash2, Edit3, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { ProfilePhotoUploadModal } from "@/components/modals/ProfilePhotoUploadModal";
import { UpdatePasskeyModal } from "@/components/modals/UpdatePasskeyModal";
import { InviteFriendsModal } from "@/components/modals/InviteFriendsModal";
import { DeleteAccountModal } from "@/components/modals/DeleteAccountModal";

export function ProfileDropdown() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!user) return null;

  const getInitials = (email: string) => {
    const parts = email.split("@")[0];
    return parts[0]?.toUpperCase() || "U";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={user.profilePhotoUrl || undefined} alt={user.email} data-ai-hint="profile avatar" />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">
                Passkey: {user.passKey.substring(0,4)}...
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPhotoModalOpen(true)}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload/Update Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsPasskeyModalOpen(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Update Pass Key
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsInviteModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Friends
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            Toggle Theme
          </DropdownMenuItem>
           <DropdownMenuItem disabled>
            <Bell className="mr-2 h-4 w-4" />
            Notification Preferences
          </DropdownMenuItem>
           <DropdownMenuItem disabled>
            <UserMinus className="mr-2 h-4 w-4" />
            Blocked Users List
          </DropdownMenuItem>
           <DropdownMenuItem disabled>
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
          {/* Dummy Feature Buttons */}
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            Feature 1
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Users className="mr-2 h-4 w-4" />
            Feature 2
          </DropdownMenuItem>
          {/* End Dummy Feature Buttons */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfilePhotoUploadModal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} />
      <UpdatePasskeyModal isOpen={isPasskeyModalOpen} onClose={() => setIsPasskeyModalOpen(false)} />
      <InviteFriendsModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </>
  );
}
