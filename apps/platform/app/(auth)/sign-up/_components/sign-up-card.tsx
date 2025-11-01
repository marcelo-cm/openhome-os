'use client';

import { useState } from 'react';

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
import { useRouter } from 'next/navigation';

import useUserAuthentication from '@/models/user/hooks/use-user-authentication';

import AuthForm from '@/app/_components/auth-form';
import { UserRole } from '@/models/user/user-enums';

const SignUpCard = () => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { signUp, signInWithOAuth } = useUserAuthentication();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleOAuthSignIn = () => {
    signInWithOAuth.mutate({ provider: 'google' });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;

    signUp.mutate(
      {
        data: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role: UserRole.USER,
          organization_id: undefined,
        },
        profilePicture,
      },
      {
        onSuccess: () => {
          // Redirect to home on success
          router.push('/home');
        },
      },
    );
  };

  const isLoading = signUp.isPending || signInWithOAuth.isPending;

  return (
    <Card className="w-full max-w-md" variant="ring">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to get started with OpenHome OS.
        </CardDescription>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardPanel>
          <AuthForm
            mode="sign-up"
            isLoading={isLoading}
            profilePictureUrl={previewUrl}
            onProfilePictureChange={handleFileChange}
          />
        </CardPanel>
        <CardFooter>
          <div className="flex w-full flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {signUp.isPending ? 'Creating account...' : 'Sign Up'}
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
              onClick={handleOAuthSignIn}
              disabled={isLoading}
            >
              <GoogleIcon className="absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              {signInWithOAuth.isPending
                ? 'Redirecting to Google...'
                : 'Sign up with Google'}
            </Button>

            {/* Sign In Link */}
            <div className="flex flex-row items-center justify-center gap-1">
              <p className="text-muted-foreground/72 text-center text-sm">
                Already have an account?
              </p>
              <Link
                className="text-primary text-sm font-medium duration-50 ease-in-out hover:animate-pulse"
                href="/sign-in"
              >
                Sign In
              </Link>
            </div>
          </div>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default SignUpCard;
