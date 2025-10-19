import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Frame, FramePanel } from '@/components/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../system-management-section';
import SystemUserCreationDialog from './system-user-creation-dialog';
import SystemUserManagementTable from './system-user-management-table';

const SystemUserManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="User Management"
        description="Manage users and their roles in the system."
      >
        <SystemUserCreationDialog>
          <Button variant="outline" size="sm">
            Add User <PlusIcon />
          </Button>
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
