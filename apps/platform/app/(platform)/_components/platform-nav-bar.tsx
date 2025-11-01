'use client';

import { LogOutIcon, UserIcon } from 'lucide-react';

import AppAvatar from '@openhome-os/particles/app-avatar';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@openhome-os/ui/menu';
import Link from 'next/link';

import { signOut } from '@/models/user/user-actions';

import { useUser } from '../_layers/_providers/user-provider';

const PlatformNavBar = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="pointer-events-none flex w-full justify-end p-4">
      <Menu openOnHover delay={0}>
        <MenuTrigger
          nativeButton={false}
          className="pointer-events-auto ml-auto size-8 overflow-hidden rounded-full"
          render={
            <AppAvatar
              name={`${user?.first_name} ${user?.last_name}`}
              src={user?.profile_picture_url}
              width={32}
              height={32}
            />
          }
        />
        <MenuPopup align="end" className={'pointer-events-auto'}>
          <MenuItem
            render={
              <Link href="/settings/me">
                <UserIcon />
                <span>Profile</span>
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
