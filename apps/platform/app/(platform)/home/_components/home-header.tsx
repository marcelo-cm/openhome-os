'use client';

import { ItemCategory } from '@openhome-os/core/models/item/item-enums';
import { Button } from '@openhome-os/ui/button';
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@openhome-os/ui/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '@/hooks/user/use-user';

import PlatformSectionHeader from '../../_components/platform-section-header';

const HomeHeader = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';

  const content = isHomePage ? (
    <PlatformSectionHeader
      title={`Welcome back, ${user.first_name}!`}
      description="Here you can manage your locations, items, and more."
    />
  ) : (
    <PlatformSectionHeader
      title={`Welcome back, ${user.first_name}!`}
      description="Here you can manage your locations, items, and more."
      href="/home"
      as={Link}
    />
  );

  return (
    <div className="flex w-full items-center justify-between gap-2">
      {content}
      <Menu>
        <MenuTrigger render={<Button variant="outline" />}>
          Register
        </MenuTrigger>
        <MenuPopup>
          {Object.values(ItemCategory).map((category) => (
            <MenuItem
              key={category}
              render={<Link href={`/${category}/register`} />}
            >
              {category}
            </MenuItem>
          ))}
        </MenuPopup>
      </Menu>
    </div>
  );
};

export default HomeHeader;
