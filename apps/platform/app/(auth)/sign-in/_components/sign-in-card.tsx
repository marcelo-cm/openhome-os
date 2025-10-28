'use client';

import { GoogleIcon } from '@openhome-os/icons/google';
import { Button } from '@openhome-os/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@openhome-os/ui/card';
import { Form } from '@openhome-os/ui/form';
import Link from 'next/link';

import useUserAuthentication from '@/models/user/hooks/use-user-authentication';

import AuthForm from '@/app/_components/auth-form';

const AuthCard = () => {
  const { signIn, signInWithOAuth } = useUserAuthentication();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    signIn.mutate({ email, password });
  };

  const handleGoogleSignIn = () => {
    signInWithOAuth.mutate({ provider: 'google' });
  };

  const isLoading = signIn.isPending || signInWithOAuth.isPending;

  return (
    <Card className="w-full max-w-sm" variant="ring">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardPanel>
          <AuthForm mode="sign-in" isLoading={isLoading} />
        </CardPanel>
        <CardFooter>
          <div className="flex w-full flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {signIn.isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="flex flex-row items-center justify-center gap-2">
              <span className="w-full border-t" />
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground shrink-0 px-2">Or</span>
              </div>
              <span className="w-full border-t" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <GoogleIcon className="mr-2 size-4" />
              {signInWithOAuth.isPending
                ? 'Redirecting to Google...'
                : 'Sign in with Google'}
            </Button>

            <div className="flex flex-row items-center justify-center gap-1">
              <p className="text-muted-foreground/72 text-center text-sm">
                Don&apos;t have an account?
              </p>
              <Link
                className="text-primary text-sm font-medium duration-50 ease-in-out hover:animate-pulse"
                href="/sign-up"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default AuthCard;
