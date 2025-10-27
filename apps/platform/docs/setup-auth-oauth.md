# Authentication & OAuth Setup Guide

This guide will walk you through the manual steps needed to complete the authentication and OAuth setup for OpenHomeOS.

## What Has Been Implemented

✅ **Database Schema**

- Added `profile_picture_url` field to users table
- Database migrations generated

✅ **Storage Helpers**

- Created `lib/supabase/storage.ts` with functions to upload/delete profile pictures
- Support for both client-side and server-side uploads

✅ **Authentication Service**

- Implemented `signIn` method in `user-service.ts` using Supabase Auth
- Implemented `signUp` method that creates both auth user and database record
- Implemented `syncOAuthUser` method to handle OAuth user data

✅ **Sign-up Page**

- Full sign-up form at `/auth/sign-up`
- Collects: first name, last name, email, password, optional profile picture
- Profile picture preview before upload
- Google OAuth button
- Error handling and loading states

✅ **OAuth Callback Handler**

- Route at `/auth/callback` handles OAuth redirects
- Automatically syncs OAuth user data (name, email, profile picture) to database

✅ **Middleware**

- Root middleware configured to protect routes
- Handles session refresh and authentication checks

## Manual Setup Steps Required

### 1. Create Supabase Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `profile-pictures`
   - **Public bucket**: ✅ Enable (allows public read access for profile pictures)
   - **File size limit**: Set to a reasonable limit (e.g., 2MB)
   - **Allowed MIME types**: `image/*` (or specific types like `image/jpeg,image/png,image/webp`)

5. Set up bucket policies:

   ```sql
   -- Allow authenticated users to upload their own profile pictures
   CREATE POLICY "Users can upload their own profile pictures"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'profile-pictures');

   -- Allow authenticated users to update their own profile pictures
   CREATE POLICY "Users can update their own profile pictures"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'profile-pictures');

   -- Allow public read access to all profile pictures
   CREATE POLICY "Public can read profile pictures"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'profile-pictures');

   -- Allow users to delete their own profile pictures
   CREATE POLICY "Users can delete their own profile pictures"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'profile-pictures');
   ```

### 2. Enable Google OAuth Provider

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to enable it
3. You'll need to create a Google OAuth application:

#### Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Configure the OAuth consent screen if prompted
7. Set **Application type** to **Web application**
8. Add **Authorized redirect URIs**:

   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```

   For local development, also add:

   ```
   http://localhost:54321/auth/v1/callback
   ```

9. Copy the **Client ID** and **Client Secret**

#### Configure Supabase

1. Back in Supabase, paste the **Client ID** and **Client Secret** into the Google provider settings
2. Click **Save**

### 3. Update Environment Variables

Add or update these environment variables in your `.env.local` file:

```env
# Supabase Configuration (should already exist)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL for OAuth redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Update for production
```

### 4. Run Database Migrations

Apply the database schema changes:

```bash
pnpm run db:push
```

### 5. Test the Implementation

#### Test Email/Password Sign-up

1. Start your development server: `pnpm run dev`
2. Navigate to `http://localhost:3000/auth/sign-up`
3. Fill out the form:
   - First name, last name
   - Email address
   - Password (min 8 characters)
   - Optional: Upload a profile picture
4. Click "Create Account"
5. You should be redirected to `/home`

#### Test Google OAuth

1. On the sign-up page, click "Continue with Google"
2. You'll be redirected to Google's OAuth consent screen
3. Select your Google account and authorize the app
4. You'll be redirected back to your app at `/auth/callback`
5. The callback handler will sync your Google profile data (name, email, profile picture)
6. You'll be redirected to `/home`

#### Verify in Database

Check that:

- User record created in `users` table
- Supabase Auth user created (check in Supabase Dashboard → Authentication → Users)
- Profile picture URL stored correctly (if uploaded)
- For OAuth users, name and profile picture synced from Google

### 6. Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Add production OAuth redirect URI to Google Cloud Console
- [ ] Verify Supabase Storage bucket policies are configured correctly
- [ ] Test OAuth flow on production domain
- [ ] Set up proper error monitoring for auth failures
- [ ] Configure email templates in Supabase for verification emails (if needed)

## Troubleshooting

### Profile Picture Upload Fails

**Problem**: "Failed to upload profile picture" error

**Solutions**:

1. Verify the `profile-pictures` bucket exists in Supabase Storage
2. Check bucket is set to public read access
3. Verify storage policies are configured correctly
4. Check browser console for detailed error messages

### OAuth Redirect Fails

**Problem**: After clicking "Continue with Google", nothing happens or error occurs

**Solutions**:

1. Verify Google OAuth is enabled in Supabase dashboard
2. Check that Client ID and Client Secret are correctly configured
3. Verify redirect URI in Google Cloud Console matches your Supabase project
4. Check browser console and network tab for error details
5. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### User Not Created in Database

**Problem**: OAuth succeeds but user record not in database

**Solutions**:

1. Check server logs for errors in `/auth/callback` route
2. Verify `syncOAuthUser` action is being called
3. Check database permissions for inserting users
4. Look for constraint violations (e.g., unique email)

### Session Not Persisting

**Problem**: User gets logged out after page refresh

**Solutions**:

1. Verify middleware is configured correctly at root level
2. Check that Supabase cookies are being set properly
3. Verify middleware matcher pattern includes all protected routes
4. Check browser's cookie settings and ensure cookies aren't being blocked

## Architecture Overview

### Authentication Flow (Email/Password)

```
User fills form → Submit
  ↓
uploadProfilePicture() (if file selected)
  ↓
signup() action → UserService.signUp()
  ↓
Supabase Auth creates user
  ↓
Database user record created
  ↓
Redirect to /home
```

### OAuth Flow

```
User clicks "Continue with Google"
  ↓
signInWithOAuth() called
  ↓
Redirect to Google OAuth consent
  ↓
User authorizes
  ↓
Google redirects to /auth/callback
  ↓
exchangeCodeForSession()
  ↓
syncOAuthUser() creates/updates database record
  ↓
Redirect to /home
```

### Middleware Protection

```
User requests page
  ↓
Middleware intercepts
  ↓
updateSession() checks Supabase Auth
  ↓
If authenticated: Continue to page
If not authenticated + protected route: Redirect to /auth
If authenticated + auth page: Redirect to /home
```

## Additional Features to Consider

### Email Verification

Currently, the implementation doesn't require email verification. To add:

1. Enable email verification in Supabase dashboard
2. Configure email templates
3. Update sign-up flow to show "check your email" message
4. Handle email confirmation redirect

### Password Reset

Add a "Forgot Password" link and implement:

1. Password reset request page
2. Call `supabase.auth.resetPasswordForEmail()`
3. Handle password reset redirect
4. Create password update form

### Profile Picture Management

Add ability to update/delete profile pictures after sign-up:

1. Create profile settings page
2. Allow users to upload new profile picture
3. Delete old profile picture when updating
4. Use `deleteProfilePicture()` helper from `storage.ts`

### Social Sign-in (Other Providers)

To add more OAuth providers (GitHub, Facebook, etc.):

1. Enable provider in Supabase dashboard
2. Configure OAuth app with that provider
3. Add button to sign-up page
4. Update `signInWithOAuth` action to support new provider
5. Callback handler already supports all providers

## Support

For issues or questions:

1. Check Supabase documentation: https://supabase.com/docs
2. Review error logs in browser console and server logs
3. Check Supabase dashboard logs (Authentication → Logs)
