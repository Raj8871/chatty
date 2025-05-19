import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLayout } from "@/components/AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout title="Create Your Secure Account">
      <SignupForm />
    </AuthLayout>
  );
}
