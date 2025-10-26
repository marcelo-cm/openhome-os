'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldControl, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form';

import { signin } from '@/models/user/user-actions';

const AuthCard = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const user = await signin({ data: { email, password } });
    router.push('/home');
  };

  return (
    <Card className="w-full max-w-sm" variant={'ring'}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardPanel>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl
                type="email"
                placeholder="Enter your email"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldControl
                type="password"
                placeholder="Enter your password"
                required
              />
            </Field>
          </div>
        </CardPanel>
        <CardFooter>
          <div className="flex-1 flex-col space-y-4">
            <Button className="w-full" type="submit">
              Sign In
            </Button>
            <div className="flex flex-row items-center justify-center gap-2">
              <p className="text-muted-foreground text-center text-sm">
                Don't have an account?
              </p>
              <Link
                className="text-primary text-sm font-bold hover:animate-pulse"
                href="/auth/sign-up"
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
