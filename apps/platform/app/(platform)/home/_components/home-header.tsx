'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '@/hooks/user/use-user';

import PlatformSectionHeader from '../../_components/platform-section-header';

const HomeHeader = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';

  return isHomePage ? (
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
};

export default HomeHeader;
