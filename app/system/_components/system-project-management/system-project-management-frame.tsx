import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Frame, FramePanel } from '@/components/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../system-management-section';
import SystemProjectCreationDialog from './system-project-creation-dialog';
import SystemProjectManagementTable from './system-project-management-table';

const SystemProjectManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Project Management"
        description="Manage projects across all organizations."
      >
        <SystemProjectCreationDialog>
          <Button variant="outline" size="sm">
            Add Project <PlusIcon />
          </Button>
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
