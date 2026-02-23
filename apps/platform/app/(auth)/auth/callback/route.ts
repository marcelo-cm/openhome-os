import { syncOAuthUserWithSetup } from '@openhome-os/core/models/user/user-actions';
import { createClient } from '@openhome-os/core/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    console.log('Code provided - exchanging code for session');
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log('Error exchanging code:', error);
      console.error('[OAuth Callback] Error exchanging code:', error);
      return NextResponse.redirect(`${origin}/auth?error=${error.message}`);
    }

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log('User found - syncing user with database');
      try {
        // Sync OAuth user with database and create organization, project, and memberships
        await syncOAuthUserWithSetup({
          authUser: {
            id: user.id,
            email: user.email!,
          },
          profileData: {
            first_name:
              user.user_metadata?.full_name?.split(' ')[0] ||
              user.user_metadata?.name?.split(' ')[0] ||
              'User',
            last_name:
              user.user_metadata?.full_name?.split(' ').slice(1).join(' ') ||
              user.user_metadata?.name?.split(' ').slice(1).join(' ') ||
              '',
            profile_picture_url:
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              undefined,
          },
        });
      } catch (syncError) {
        console.error('[OAuth Callback] Error syncing user:', syncError);
        return NextResponse.redirect(
          `${origin}/auth?error=Failed to sync user data`,
        );
      }
    }

    console.log('Successful authentication - redirecting to home');

    // Successful authentication - redirect to home
    return NextResponse.redirect(`${origin}/home`);
  }

  console.log('No code provided - redirecting to auth page');

  // No code provided - redirect to auth page
  return NextResponse.redirect(`${origin}/auth`);
}
