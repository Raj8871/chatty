
import { RecoverPasskeyForm } from "@/components/auth/RecoverPasskeyForm";
import { AuthLayout } from "@/components/AuthLayout";

export default function RecoverPasskeyPage() {
  return (
    <AuthLayout title="Recover Your Pass Key">
      <RecoverPasskeyForm />
    </AuthLayout>
  );
}
