export interface User {
  id: string;
  email: string;
  question1: string;
  question2: string;
  question3: string;
  passKey: string;
  profilePhotoUrl?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  messageText?: string;
  imageUrl?: string;
  videoLink?: string;
  otherLink?: string;
  timestamp: string;
  readAt?: string;
}

export interface Contact {
  id: string;
  userId: string; // ID of the contact for the current user
  userName: string; // Name of the contact
  profilePhotoUrl?: string;
}

export interface Invite {
  id: string;
  code: string;
  ownerId: string;
  createdAt: string;
  usedById?: string;
}
