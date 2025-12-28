'use client';

import { HomeIcon, LogOutIcon, ShirtIcon, UserIcon } from 'lucide-react';

import { signOut } from '@openhome-os/core/models/user/user-actions';
import AppAvatar from '@openhome-os/particles/app-avatar';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@openhome-os/ui/menu';
import Link from 'next/link';

import { useUser } from '@/hooks/user/use-user';

const PlatformNavBar = () => {
  const { user } = useUser();

  return (
    <div className="pointer-events-none flex w-full justify-end p-4">
      <Menu openOnHover delay={0}>
        <MenuTrigger
          nativeButton={false}
          className="pointer-events-auto ml-auto size-8 overflow-hidden rounded-full"
          render={
            <AppAvatar
              name={`${user.first_name} ${user.last_name}`}
              src={user.profile_picture_url}
              width={32}
              height={32}
            />
          }
        />
        <MenuPopup align="end" className={'pointer-events-auto'}>
          <MenuItem
            render={
              <Link href="/settings/me" prefetch={true}>
                <UserIcon />
                <span>Profile</span>
              </Link>
            }
          />
          <MenuItem
            render={
              <Link href="/home" prefetch={true}>
                <HomeIcon />
                <span>Home</span>
              </Link>
            }
          />
          <MenuItem
            render={
              <Link href="/closet" prefetch={true}>
                <ShirtIcon />
                <span>Closet</span>
              </Link>
            }
          />
          <MenuSeparator />
          <MenuItem onClick={signOut}>
            <LogOutIcon />
            <span>Logout</span>
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  );
};

export default PlatformNavBar;
