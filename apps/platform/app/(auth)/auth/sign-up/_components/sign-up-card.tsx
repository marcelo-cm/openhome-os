'use client';

import { useState } from 'react';

import { Button } from '@openhome-os/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@openhome-os/ui/card';
import { Field, FieldControl, FieldLabel } from '@openhome-os/ui/field';
import { Form } from '@openhome-os/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signInWithOAuth, signup } from '@/models/user/user-actions';
import { UserRole } from '@/models/user/user-enums';

const SignUpCard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleOAuthSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { url } = await signInWithOAuth({ provider: 'google' });
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (err) {
      console.error('[OAuth Sign In]', err);
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const firstName = formData.get('first_name') as string;
      const lastName = formData.get('last_name') as string;

      // Upload profile picture first if one was selected

      // Create user account
      const user = await signup({
        data: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role: UserRole.USER,
          organization_id: undefined,
        },
        profilePicture,
      });

      // Redirect to home on success
      router.push('/home');
    } catch (err) {
      console.error('[Sign Up]', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md" variant={'ring'}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to get started with OpenHomeOS.
        </CardDescription>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardPanel>
          <div className="flex flex-col gap-4">
            {/* First Name */}
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <FieldControl
                name="first_name"
                type="text"
                placeholder="Enter your first name"
                required
                disabled={isLoading}
              />
            </Field>

            {/* Last Name */}
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <FieldControl
                name="last_name"
                type="text"
                placeholder="Enter your last name"
                disabled={isLoading}
              />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldControl
                name="password"
                type="password"
                placeholder="Enter your password (min 8 characters)"
                required
                minLength={8}
                disabled={isLoading}
              />
            </Field>

            {/* Profile Picture Upload */}
            <Field>
              <FieldLabel>Profile Picture (Optional)</FieldLabel>
              <div className="flex flex-col items-center gap-3">
                {previewUrl && (
                  <div className="border-muted relative size-24 overflow-hidden rounded-full border-2">
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
                />
              </div>
            </Field>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}
          </div>
        </CardPanel>
        <CardFooter>
          <div className="flex w-full flex-col gap-4">
            {/* Sign Up Button */}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Divider */}
            <div className="flex flex-row items-center justify-center gap-2">
              <span className="w-full border-t" />
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-muted-foreground shrink-0 px-2">
                  Or continue with
                </span>
              </div>
              <span className="w-full border-t" />
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleOAuthSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            {/* Sign In Link */}
            <div className="flex flex-row items-center justify-center gap-2">
              <p className="text-muted-foreground text-center text-sm">
                Already have an account?
              </p>
              <Link
                className="text-primary text-sm font-bold hover:animate-pulse"
                href="/auth"
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
