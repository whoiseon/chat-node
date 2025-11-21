import AuthTemplate from '@/features/auth/components/auth-template';
import SignupForm from '@/features/auth/components/signup-form';

export default function Page() {
  return (
    <AuthTemplate>
      <SignupForm />
    </AuthTemplate>
  );
}
