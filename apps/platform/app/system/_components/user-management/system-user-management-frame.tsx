import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';
import { DialogTrigger } from '@openhome-os/ui/dialog';
import { Frame, FramePanel } from '@openhome-os/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../management-section';
import SystemUserCreationDialog from './system-user-creation-dialog';
import SystemUserManagementTable from './system-user-management-table';

const SystemUserManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Users"
        description="Manage users and their roles in the system."
        info="Users are the individuals who have access to the system. They can be assigned roles to perform different actions."
      >
        <SystemUserCreationDialog>
          <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
            <PlusIcon />
          </DialogTrigger>
        </SystemUserCreationDialog>
      </SystemManagementSectionHeader>
      <SystemManagementSectionPanel>
        <Frame>
          <FramePanel>
            <SystemUserManagementTable />
          </FramePanel>
        </Frame>
      </SystemManagementSectionPanel>
    </SystemManagementSection>
  );
};

export default SystemUserManagement;
