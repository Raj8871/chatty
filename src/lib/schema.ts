import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  question1: z.string().min(5, { message: "Security question must be at least 5 characters." }),
  question2: z.string().min(5, { message: "Security question must be at least 5 characters." }),
  question3: z.string().min(5, { message: "Security question must be at least 5 characters." }),
});
export type SignupFormValues = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  passKey: z.string().min(6, { message: "Passkey must be 6-8 characters." }).max(8, { message: "Passkey must be 6-8 characters." })
});
export type LoginFormValues = z.infer<typeof LoginSchema>;

export const UpdatePasskeySchema = z.object({
  question1: z.string().min(5, { message: "Security question must be at least 5 characters." }),
  question2: z.string().min(5, { message: "Security question must be at least 5 characters." }),
  question3: z.string().min(5, { message: "Security question must be at least 5 characters." }),
});
export type UpdatePasskeyFormValues = z.infer<typeof UpdatePasskeySchema>;

export const RecoverPasskeySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  answer1: z.string().min(5, { message: "Security answer must be at least 5 characters." }),
  answer2: z.string().min(5, { message: "Security answer must be at least 5 characters." }),
  answer3: z.string().min(5, { message: "Security answer must be at least 5 characters." }),
});
export type RecoverPasskeyFormValues = z.infer<typeof RecoverPasskeySchema>;

export const InviteCodeSchema = z.object({
  code: z.string().length(8, { message: "Invite code must be 8 characters." }),
});
export type InviteCodeFormValues = z.infer<typeof InviteCodeSchema>;

export const MessageSchema = z.object({
  text: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  videoLink: z.string().url().optional().or(z.literal('')),
  otherLink: z.string().url().optional().or(z.literal('')),
}).refine(data => data.text || data.imageUrl || data.videoLink || data.otherLink, {
  message: "Message cannot be empty. Please provide text or a link/image.",
  path: ["text"], // Attach error to a common field or the first field
});
export type MessageFormValues = z.infer<typeof MessageSchema>;
