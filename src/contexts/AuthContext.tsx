// @ts-nocheck
"use client";

import type { User } from "@/types";
import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { generatePasskey } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { RecoverPasskeyFormValues } from "@/lib/schema";


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (data: Pick<User, "email" | "question1" | "question2" | "question3">) => Promise<void>;
  login: (passKey: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<Pick<User, "profilePhotoUrl">>) => Promise<void>;
  updateUserPassKey: (data: Pick<User, "question1" | "question2" | "question3">) => Promise<void>;
  recoverPasskey: (data: RecoverPasskeyFormValues) => Promise<string | null>;
  theme: string;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mocked user data for demonstration. In a real app, this would come from Supabase.
const MOCKED_USERS_DB_KEY = "passkeyChatUsers";

const getMockedUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const storedUsers = localStorage.getItem(MOCKED_USERS_DB_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
};

const saveMockedUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCKED_USERS_DB_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
    setIsLoading(false);
  }, []);

  const signup = async (data: Pick<User, "email" | "question1" | "question2" | "question3">) => {
    setIsLoading(true);
    const users = getMockedUsers();
    if (users.find(u => u.email === data.email)) {
      toast({ title: "Signup Failed", description: "Email already exists.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const newPassKey = generatePasskey();
    const newUser: User = {
      id: String(Date.now()), // Simple ID generation
      ...data,
      passKey: newPassKey,
      createdAt: new Date().toISOString(),
      profilePhotoUrl: `https://placehold.co/100x100.png?text=${data.email[0].toUpperCase()}`,
    };
    
    users.push(newUser);
    saveMockedUsers(users);
    
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);
    toast({ title: "Signup Successful!", description: `Your Pass Key: ${newPassKey}. Please save it securely.`});
    router.push("/");
    setIsLoading(false);
  };

  const login = async (passKey: string) => {
    setIsLoading(true);
    const users = getMockedUsers();
    const foundUser = users.find(u => u.passKey === passKey);

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setUser(foundUser);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/");
    } else {
      toast({ title: "Login Failed", description: "Invalid Pass Key.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };
  
  const updateUserProfile = async (data: Partial<Pick<User, "profilePhotoUrl">>) => {
    if (!user) return;
    setIsLoading(true);
    const updatedUser = { ...user, ...data };
    
    const users = getMockedUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveMockedUsers(users);
    }

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast({ title: "Profile Updated", description: "Your profile photo has been updated." });
    setIsLoading(false);
  };

  const updateUserPassKey = async (data: Pick<User, "question1" | "question2" | "question3">) => {
     if (!user) return;
    setIsLoading(true);
    const newPassKey = generatePasskey();
    const updatedUser = { ...user, ...data, passKey: newPassKey };

    const users = getMockedUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveMockedUsers(users);
    }
    
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast({ title: "Pass Key Updated", description: `Your new Pass Key: ${newPassKey}. Please save it securely.`});
    setIsLoading(false);
  };

  const recoverPasskey = async (data: RecoverPasskeyFormValues): Promise<string | null> => {
    setIsLoading(true);
    const users = getMockedUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (!foundUser) {
      toast({ title: "Recovery Failed", description: "Email not found.", variant: "destructive" });
      setIsLoading(false);
      return null;
    }

    // Note: In the current User model, 'question1', 'question2', 'question3' store the answers.
    if (
      foundUser.question1 === data.answer1 &&
      foundUser.question2 === data.answer2 &&
      foundUser.question3 === data.answer3
    ) {
      // Passkey will be displayed in the form, no toast here for the key itself.
      // toast({ title: "Recovery Successful", description: "Your pass key is displayed below." });
      setIsLoading(false);
      return foundUser.passKey;
    } else {
      toast({ title: "Recovery Failed", description: "Security answers do not match.", variant: "destructive" });
      setIsLoading(false);
      return null;
    }
  };


  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout, updateUserProfile, updateUserPassKey, recoverPasskey, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
