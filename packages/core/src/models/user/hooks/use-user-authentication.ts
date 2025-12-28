import { toast } from '@openhome-os/ui/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { signInWithOAuth, signin, signup } from '../user-actions';
import type { TCreateUser } from '../user-types';

const useUserAuthentication = () => {
  const router = useRouter();

  // Sign In mutation
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const user = await signin({ data: { email, password } });
      return user;
    },
    onSuccess: () => {
      router.push('/home');
    },
    onError: (error) => {
      toast.add({
        title: 'Error signing in',
        description: error.message,
        type: 'error',
      });
    },
  });

  // Sign Up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({
      data,
      profilePicture,
    }: {
      data: TCreateUser;
      profilePicture: File | null;
    }) => {
      const user = await signup({ data, profilePicture });
      return user;
    },
    onSuccess: () => {
      router.push('/home');
    },
    onError: (error) => {
      toast.add({
        title: 'Error signing up',
        description: error.message,
        type: 'error',
      });
    },
  });

  // OAuth Sign In mutation
  const signInWithOAuthMutation = useMutation({
    mutationFn: async ({ provider }: { provider: 'google' }) => {
      const { url } = await signInWithOAuth({ provider });
      console.log('url', url);
      return url;
    },
    onSuccess: (url) => {
      // OAuth requires a full page redirect, not client-side navigation
      window.location.href = url;
    },
    onError: (error) => {
      toast.add({
        title: 'Error signing in with OAuth',
        description: error.message,
        type: 'error',
      });
    },
  });

  return {
    signIn: signInMutation,
    signInWithOAuth: signInWithOAuthMutation,
    signUp: signUpMutation,
  };
};

export default useUserAuthentication;
