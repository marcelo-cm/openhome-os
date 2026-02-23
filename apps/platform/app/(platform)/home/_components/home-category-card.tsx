import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@openhome-os/ui/card';

import type { HomeCategoryConfig } from './home-constants';

const HomeCategoryCard = ({ title, description }: HomeCategoryConfig) => {
  return (
    <Card variant={'ring'} className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default HomeCategoryCard;
