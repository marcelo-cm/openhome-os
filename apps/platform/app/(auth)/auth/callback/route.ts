import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { syncOAuthUser } from '@/models/user/user-actions';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[OAuth Callback] Error exchanging code:', error);
      return NextResponse.redirect(`${origin}/auth?error=${error.message}`);
    }

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      try {
        // Sync OAuth user with database
        await syncOAuthUser({
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

    // Successful authentication - redirect to home
    return NextResponse.redirect(`${origin}/home`);
  }

  // No code provided - redirect to auth page
  return NextResponse.redirect(`${origin}/auth`);
}
