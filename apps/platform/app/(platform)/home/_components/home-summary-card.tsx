import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@openhome-os/ui/card';

const HomeSummaryCard = () => {
  return (
    <Card variant={'ring'} className="w-full">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          This is the summary of your home. You can manage your locations,
          items, and more.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default HomeSummaryCard;
