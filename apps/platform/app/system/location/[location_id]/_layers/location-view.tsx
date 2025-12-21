import { Suspense } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@openhome-os/ui/card';
import { DialogTrigger } from '@openhome-os/ui/dialog';
import { Frame, FramePanel } from '@openhome-os/ui/frame';

import { TLocation } from '@/models/location/location-types';

import LocationMembershipCreationDialog from '../_components/location-membership-creation-dialog';
import LocationMembershipManagementTable from '../_components/location-membership-management-table';

interface LocationViewProps {
  location: TLocation;
}

const LocationView = ({ location }: LocationViewProps) => {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <Card variant={'ring'} className="w-full">
        <CardHeader>
          <CardTitle>{location.name}</CardTitle>
          <CardDescription>
            Created{' '}
            {location.created_at.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Members</h2>
            <p className="text-muted-foreground text-sm">
              Users with access to this location.
            </p>
          </div>
          <Suspense>
            <LocationMembershipCreationDialog locationId={location.id}>
              <DialogTrigger
                render={<Button variant="outline" size="icon-sm" />}
              >
                <PlusIcon />
              </DialogTrigger>
            </LocationMembershipCreationDialog>
          </Suspense>
        </div>
        <Frame>
          <FramePanel>
            <LocationMembershipManagementTable locationId={location.id} />
          </FramePanel>
        </Frame>
      </div>
    </div>
  );
};

export default LocationView;
