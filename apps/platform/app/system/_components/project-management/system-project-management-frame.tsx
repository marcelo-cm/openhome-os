import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';
import { DialogTrigger } from '@openhome-os/ui/dialog';
import { Frame, FramePanel } from '@openhome-os/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../management-section';
import SystemProjectCreationDialog from './system-project-creation-dialog';
import SystemProjectManagementTable from './system-project-management-table';

const SystemProjectManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Projects"
        description="Manage projects across all organizations."
        info="Projects are the top-level entities in the system. They can be used to group locations."
      >
        <SystemProjectCreationDialog>
          <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
            <PlusIcon />
          </DialogTrigger>
        </SystemProjectCreationDialog>
      </SystemManagementSectionHeader>
      <SystemManagementSectionPanel>
        <Frame>
          <FramePanel>
            <SystemProjectManagementTable />
          </FramePanel>
        </Frame>
      </SystemManagementSectionPanel>
    </SystemManagementSection>
  );
};

export default SystemProjectManagement;
