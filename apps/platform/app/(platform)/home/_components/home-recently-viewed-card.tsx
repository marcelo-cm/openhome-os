import { Card, CardHeader, CardTitle } from '@openhome-os/ui/card';

const HomeRecentlyViewedCard = () => {
  return (
    <Card variant={'ring'} className="w-full">
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default HomeRecentlyViewedCard;
