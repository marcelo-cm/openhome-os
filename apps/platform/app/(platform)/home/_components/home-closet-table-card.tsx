import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@openhome-os/ui/card';
import Link from 'next/link';

const HomeClosetTableCard = () => {
  return (
    <Card variant={'ring'} className="w-full">
      <CardHeader>
        <Link href="/home/closet">
          <CardTitle>Your Closet</CardTitle>
        </Link>
        <CardDescription>
          This is a list of your clothing items. You can manage your items, and
          more.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default HomeClosetTableCard;
