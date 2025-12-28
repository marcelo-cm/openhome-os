# Authentication and OAuth Setup Guide

This guide covers the manual setup steps required to complete the authentication system with Google OAuth and profile picture uploads.

## 1. Database Migration

Run the following commands to apply the database schema changes:

```bash
pnpm run db:generate
pnpm run db:push
```

This will add the `profile_picture_url` field to the users table.

## 2. Supabase Storage Setup

### Create Profile Pictures Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `profile-pictures`
   - **Public bucket**: ✅ Enable (so profile pictures can be viewed publicly)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### Set Bucket Policies

After creating the bucket, set up the following policies in the **Policies** tab:

**Policy 1: Public Read Access**

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');
```

**Policy 2: Authenticated Upload**

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');
```

**Policy 3: Users can update their own pictures**

```sql
CREATE POLICY "Users can update own pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Policy 4: Users can delete their own pictures**

```sql
CREATE POLICY "Users can delete own pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 3. Google OAuth Configuration

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Application type**: Web application
7. Add authorized redirect URIs:
   ```
   https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback (for local development)
   ```
8. Copy the **Client ID** and **Client Secret**

### Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and enable it
4. Enter your Google OAuth credentials:
   - **Client ID**: Paste the Client ID from Google
   - **Client Secret**: Paste the Client Secret from Google
5. Click **Save**

## 4. Environment Variables

Add the following to your `.env.local` file (if not already present):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL (used for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Update for production
```

## 5. Test the Implementation

### Test Sign Up Flow

1. Navigate to `http://localhost:3000/auth/sign-up`
2. Fill in the form:
   - Add a profile picture (optional)
   - Enter first name and last name
   - Enter email and password
3. Click **Sign Up**
4. You should be redirected to `/home` upon successful registration

### Test Google OAuth

1. Navigate to `http://localhost:3000/auth` or `/auth/sign-up`
2. Click **Sign in with Google** or **Sign up with Google**
3. Complete the Google OAuth flow
4. You should be redirected to `/home`
5. Check your database - a new user record should be created with data from Google

### Test Sign In Flow

1. Navigate to `http://localhost:3000/auth`
2. Enter the email and password from your sign-up
3. Click **Sign In**
4. You should be redirected to `/home`

## 6. Middleware Configuration (Optional)

If you haven't already, create a `middleware.ts` file at the root of your project:

```typescript
import { updateSession } from '@/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

This will:

- Automatically refresh user sessions
- Redirect unauthenticated users to `/auth`
- Redirect authenticated users away from auth pages

## Troubleshooting

### Profile Picture Upload Fails

- Check that the `profile-pictures` bucket exists and is public
- Verify bucket policies are set correctly
- Check browser console for specific error messages

### Google OAuth Fails

- Verify the redirect URI in Google Console matches your Supabase project
- Check that Google OAuth is enabled in Supabase dashboard
- Ensure Client ID and Secret are correct
- Check browser console for error messages

### User Creation Fails

- Check database logs in Supabase dashboard
- Verify the users table has the `profile_picture_url` field
- Check server logs for specific error messages

## Security Considerations

1. **Profile Pictures**: Currently public. Consider adding user-specific folders if you need more privacy
2. **File Size Limits**: Set appropriate limits in Supabase Storage to prevent abuse
3. **OAuth Scopes**: Google OAuth only requests basic profile info (name, email, avatar)
4. **Password Requirements**: Minimum 8 characters enforced in both client and schema validation

## Next Steps

- Add email verification for sign-ups
- Implement password reset functionality
- Add more OAuth providers (GitHub, Microsoft, etc.)
- Add profile picture cropping/resizing
- Implement organization invitations during onboarding
