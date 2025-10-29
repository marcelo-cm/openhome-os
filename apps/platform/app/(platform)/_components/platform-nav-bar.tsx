'use client';

import { UserIcon } from 'lucide-react';

import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@openhome-os/ui/menu';
import Image from 'next/image';
import Link from 'next/link';

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
          className="pointer-events-auto ml-auto size-8 overflow-hidden rounded-full"
          render={
            <Image
              src={`${user?.profile_picture_url}`}
              alt={`${user?.first_name} ${user?.last_name}`}
              width={100}
              height={100}
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
        </MenuPopup>
      </Menu>
    </div>
  );
};

export default PlatformNavBar;
