import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Frame, FramePanel } from '@/components/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../system-management-section';
import SystemLocationCreationDialog from './system-location-creation-dialog';
import SystemLocationManagementTable from './system-location-management-table';

const SystemLocationManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Location Management"
        description="Manage locations across all projects."
      >
        <SystemLocationCreationDialog>
          <Button variant="outline" size="sm">
            Add Location <PlusIcon />
          </Button>
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
