import AuthTemplate from '@/features/auth/components/auth-template';
import LoginForm from '@/features/auth/components/login-form';

export default function Page() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
