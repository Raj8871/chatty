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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ProfilePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePhotoUploadModal({ isOpen, onClose }: ProfilePhotoUploadModalProps) {
  const { user, updateUserProfile, isLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePhotoUrl || null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !previewUrl) { // if no new file and no existing preview, means nothing to upload
      toast({ title: "No Image Selected", description: "Please select an image to upload.", variant: "destructive" });
      return;
    }
    // In a real app, you'd upload `selectedFile` to a storage service (e.g., Supabase Storage)
    // and get back a URL. For this mock, we'll use the preview URL directly or a placeholder.
    const newPhotoUrl = previewUrl || `https://placehold.co/100x100.png?text=${user?.email[0].toUpperCase() || 'U'}`;
    
    await updateUserProfile({ profilePhotoUrl: newPhotoUrl });
    onClose();
  };
  
  // Reset preview when modal opens with existing user photo
  useState(() => {
    if (isOpen && user?.profilePhotoUrl) {
      setPreviewUrl(user.profilePhotoUrl);
    } else if (isOpen && !user?.profilePhotoUrl) {
      setPreviewUrl(null); // Reset if no existing photo
    }
    setSelectedFile(null); // Reset selected file
  });


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>
            Choose a new photo for your profile. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile preview"
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
                data-ai-hint="profile avatar"
              />
            ) : (
               <Image
                src="https://placehold.co/128x128.png"
                alt="Profile preview"
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
                data-ai-hint="placeholder avatar"
              />
            )}
            <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="text-sm"/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
