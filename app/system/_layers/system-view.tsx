import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import SystemLocationManagement from '../_components/system-location-management/system-location-management-frame';
import SystemOrganizationManagement from '../_components/system-organization-management/system-organization-management-frame';
import SystemProjectManagement from '../_components/system-project-management/system-project-management-frame';
import SystemUserManagement from '../_components/system-user-management/system-user-management-frame';

const SystemView = () => {
  return (
    <Card
      className="flex min-h-fit w-full max-w-3xl flex-grow flex-col gap-4"
      variant={'ring'}
    >
      <CardHeader>
        <CardTitle>System Level Controls</CardTitle>
        <CardDescription>
          This is the system level controls. You can control the entire platform
          here as a super admin.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardPanel>
        <SystemUserManagement />
      </CardPanel>
      <Separator />
      <CardPanel>
        <SystemOrganizationManagement />
      </CardPanel>
      <Separator />
      <CardPanel>
        <SystemProjectManagement />
      </CardPanel>
      <Separator />
      <CardPanel>
        <SystemLocationManagement />
      </CardPanel>
    </Card>
  );
};

export default SystemView;
