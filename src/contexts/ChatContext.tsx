"use client";

import type { Contact, Message, User } from "@/types";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { generateInviteCode } from "@/lib/utils";

interface ChatContextType {
  contacts: Contact[];
  messages: Message[];
  activeChatContactId: string | null;
  setActiveChatContactId: (contactId: string | null) => void;
  sendNewMessage: (message: Omit<Message, "id" | "senderId" | "timestamp">) => Promise<void>;
  generateAndStoreInviteCode: () => Promise<string | null>;
  connectWithInviteCode: (code: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mocked DB keys for localStorage
const MOCKED_CONTACTS_DB_KEY_PREFIX = "passkeyChatContacts_";
const MOCKED_MESSAGES_DB_KEY_PREFIX = "passkeyChatMessages_";
const MOCKED_INVITES_DB_KEY = "passkeyChatInvites";

const getMockedInvites = (): { code: string, ownerId: string, ownerEmail: string }[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MOCKED_INVITES_DB_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveMockedInvites = (invites: { code: string, ownerId: string, ownerEmail: string }[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCKED_INVITES_DB_KEY, JSON.stringify(invites));
};


export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatContactId, setActiveChatContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getMockedContacts = (userId: string): Contact[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(`${MOCKED_CONTACTS_DB_KEY_PREFIX}${userId}`);
    return stored ? JSON.parse(stored) : [];
  };
  
  const saveMockedContacts = (userId: string, contactsToSave: Contact[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${MOCKED_CONTACTS_DB_KEY_PREFIX}${userId}`, JSON.stringify(contactsToSave));
  };

  const getMockedMessages = (userId: string, contactId: string): Message[] => {
    if (typeof window === "undefined") return [];
    const chatPairKey = [userId, contactId].sort().join('_');
    const stored = localStorage.getItem(`${MOCKED_MESSAGES_DB_KEY_PREFIX}${chatPairKey}`);
    return stored ? JSON.parse(stored) : [];
  };

  const saveMockedMessages = (userId: string, contactId: string, messagesToSave: Message[]) => {
    if (typeof window === "undefined") return;
    const chatPairKey = [userId, contactId].sort().join('_');
    localStorage.setItem(`${MOCKED_MESSAGES_DB_KEY_PREFIX}${chatPairKey}`, JSON.stringify(messagesToSave));
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Load contacts for the current user
      const userContacts = getMockedContacts(user.id);
      setContacts(userContacts);
      if (userContacts.length > 0 && !activeChatContactId) {
         // setActiveChatContactId(userContacts[0].userId); // Auto-select first contact
      }
      setIsLoading(false);
    } else {
      setContacts([]);
      setMessages([]);
      setActiveChatContactId(null);
    }
  }, [user]);

  useEffect(() => {
    if (user && activeChatContactId) {
      setIsLoading(true);
      // Load messages for the active chat
      const chatMessages = getMockedMessages(user.id, activeChatContactId);
      setMessages(chatMessages);
      setIsLoading(false);
    } else {
      setMessages([]);
    }
  }, [user, activeChatContactId]);

  const sendNewMessage = async (messageData: Omit<Message, "id" | "senderId" | "timestamp">) => {
    if (!user || !activeChatContactId) {
      toast({ title: "Error", description: "No active chat selected.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const newMessage: Message = {
      id: String(Date.now()),
      senderId: user.id,
      ...messageData,
      receiverId: activeChatContactId, 
      timestamp: new Date().toISOString(),
    };
    
    const currentMessages = getMockedMessages(user.id, activeChatContactId);
    const updatedMessages = [...currentMessages, newMessage];
    saveMockedMessages(user.id, activeChatContactId, updatedMessages);
    setMessages(updatedMessages);
    
    // Simulate receiver getting the message too
    const receiverMessages = getMockedMessages(activeChatContactId, user.id);
    const updatedReceiverMessages = [...receiverMessages, newMessage];
    saveMockedMessages(activeChatContactId, user.id, updatedReceiverMessages);

    toast({ title: "Message Sent", description: "Your message has been sent." });
    setIsLoading(false);
  };

  const generateAndStoreInviteCode = async (): Promise<string | null> => {
    if (!user) return null;
    setIsLoading(true);
    const code = generateInviteCode();
    const invites = getMockedInvites();
    invites.push({ code, ownerId: user.id, ownerEmail: user.email });
    saveMockedInvites(invites);
    setIsLoading(false);
    return code;
  };

  const connectWithInviteCode = async (code: string) => {
    if (!user) return;
    setIsLoading(true);
    const invites = getMockedInvites();
    const invite = invites.find(inv => inv.code === code);

    if (!invite) {
      toast({ title: "Invalid Code", description: "This invite code is not valid.", variant: "destructive"});
      setIsLoading(false);
      return;
    }
    if (invite.ownerId === user.id) {
      toast({ title: "Cannot Connect to Self", description: "You cannot use your own invite code.", variant: "destructive"});
      setIsLoading(false);
      return;
    }

    // Add to current user's contacts
    const currentUserContacts = getMockedContacts(user.id);
    if (currentUserContacts.find(c => c.userId === invite.ownerId)) {
        toast({ title: "Already Connected", description: `You are already connected with ${invite.ownerEmail}.`});
        setActiveChatContactId(invite.ownerId); // Optionally switch to this chat
        setIsLoading(false);
        return;
    }
    const newContactForCurrentUser: Contact = { 
        id: String(Date.now()), 
        userId: invite.ownerId, 
        userName: invite.ownerEmail, // Mock: use email as name
        profilePhotoUrl: `https://placehold.co/40x40.png?text=${invite.ownerEmail[0].toUpperCase()}` 
    };
    const updatedCurrentUserContacts = [...currentUserContacts, newContactForCurrentUser];
    saveMockedContacts(user.id, updatedCurrentUserContacts);
    setContacts(updatedCurrentUserContacts);

    // Add to inviter's contacts
    const inviterContacts = getMockedContacts(invite.ownerId);
     if (!inviterContacts.find(c => c.userId === user.id)) {
        const newContactForInviter: Contact = { 
            id: String(Date.now() + 1), // ensure different id
            userId: user.id, 
            userName: user.email, 
            profilePhotoUrl: user.profilePhotoUrl || `https://placehold.co/40x40.png?text=${user.email[0].toUpperCase()}`
        };
        saveMockedContacts(invite.ownerId, [...inviterContacts, newContactForInviter]);
    }
    
    toast({ title: "Connected!", description: `You are now connected with ${invite.ownerEmail}.`});
    setActiveChatContactId(invite.ownerId); // Switch to new chat
    setIsLoading(false);
  };


  return (
    <ChatContext.Provider value={{ 
      contacts, 
      messages, 
      activeChatContactId, 
      setActiveChatContactId, 
      sendNewMessage,
      generateAndStoreInviteCode,
      connectWithInviteCode,
      isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
