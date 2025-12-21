import { Suspense } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';
import { DialogTrigger } from '@openhome-os/ui/dialog';
import { Frame, FramePanel } from '@openhome-os/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../management-section';
import SystemOrganizationCreationDialog from './system-organization-creation-dialog';
import SystemOrganizationManagementTable from './system-organization-management-table';

const SystemOrganizationManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Organizations"
        description="Manage organizations and their settings."
        info="Organizations are the top-level entities in the system. They can be used to group projects and locations."
      >
        <Suspense>
          <SystemOrganizationCreationDialog>
            <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
              <PlusIcon />
            </DialogTrigger>
          </SystemOrganizationCreationDialog>
        </Suspense>
      </SystemManagementSectionHeader>
      <SystemManagementSectionPanel>
        <Frame>
          <FramePanel>
            <Suspense>
              <SystemOrganizationManagementTable />
            </Suspense>
          </FramePanel>
        </Frame>
      </SystemManagementSectionPanel>
    </SystemManagementSection>
  );
};

export default SystemOrganizationManagement;
