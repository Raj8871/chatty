import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout title="Login with Your Pass Key">
      <LoginForm />
    </AuthLayout>
  );
}
