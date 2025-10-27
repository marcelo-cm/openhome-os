import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';
import { DialogTrigger } from '@openhome-os/ui/dialog';
import { Frame, FramePanel } from '@openhome-os/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../management-section';
import SystemLocationCreationDialog from './system-location-creation-dialog';
import SystemLocationManagementTable from './system-location-management-table';

const SystemLocationManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Locations"
        description="Manage locations across all projects."
        info="Locations are the bottom-level entities in the system. They can be used to group devices and sensors."
      >
        <SystemLocationCreationDialog>
          <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
            <PlusIcon />
          </DialogTrigger>
        </SystemLocationCreationDialog>
      </SystemManagementSectionHeader>
      <SystemManagementSectionPanel>
        <Frame>
          <FramePanel>
            <SystemLocationManagementTable />
          </FramePanel>
        </Frame>
      </SystemManagementSectionPanel>
    </SystemManagementSection>
  );
};

export default SystemLocationManagement;
