import { ChangeEventHandler, HtmlHTMLAttributes, useMemo } from 'react';

import { Field, FieldControl, FieldLabel } from '@openhome-os/ui/field';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface AuthFormProps extends HtmlHTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  profilePictureUrl?: string | null;
  onProfilePictureChange?: ChangeEventHandler<HTMLInputElement>;
  mode: 'sign-in' | 'sign-up';
}

const AuthForm = ({
  isLoading,
  profilePictureUrl,
  onProfilePictureChange,
  className,
  children,
  mode,
  ...props
}: AuthFormProps) => {
  const gapClassName = useMemo(() => {
    const gap = className?.match(/gap-(\d+)/)?.[1];
    return gap ? `gap-${gap}` : 'gap-5';
  }, [className]);

  return (
    <div
      className={cn('@container/auth-form flex flex-col gap-5', className)}
      {...props}
    >
      {mode === 'sign-up' && (
        <Field className="w-full">
          <label htmlFor="profile-picture" className="mx-auto">
            <div className="flex flex-col items-center gap-3">
              {profilePictureUrl ? (
                <div className="border-muted relative size-24 overflow-hidden rounded-full border-2">
                  <Image
                    src={profilePictureUrl}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="border-border relative grid size-24 place-items-center overflow-hidden rounded-full border border-dashed p-4">
                  <p className="text-muted-foreground/72 text-xs">Optional</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={onProfilePictureChange}
                id="profile-picture"
                disabled={isLoading}
                className="hidden"
              />
            </div>
          </label>
        </Field>
      )}

      {mode === 'sign-up' && (
        <div className={cn('grid gap-5 sm:grid-cols-2', gapClassName)}>
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <FieldControl
              name="first_name"
              type="text"
              placeholder="Toni"
              required
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldLabel className="w-full">
              Last Name{' '}
              <span className="text-muted-foreground/72 ml-auto text-xs font-normal">
                Optional
              </span>
            </FieldLabel>
            <FieldControl
              name="last_name"
              type="text"
              placeholder="Akintola"
              disabled={isLoading}
            />
          </Field>
        </div>
      )}

      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl
          name="email"
          type="email"
          placeholder="toni@openhome-os.com"
          required
          disabled={isLoading}
        />
      </Field>

      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldControl
          name="password"
          type="password"
          placeholder="Minimum 8 characters..."
          required
          minLength={8}
          disabled={isLoading}
        />
      </Field>

      {children}
    </div>
  );
};

export default AuthForm;
