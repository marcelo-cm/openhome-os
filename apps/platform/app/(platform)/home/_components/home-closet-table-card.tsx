import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@openhome-os/ui/card';

const HomeClosetTableCard = () => {
  return (
    <Card variant={'ring'} className="w-full">
      <CardHeader>
        <CardTitle>Your Closet</CardTitle>
        <CardDescription>
          This is a list of your clothing items. You can manage your items, and
          more.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default HomeClosetTableCard;
