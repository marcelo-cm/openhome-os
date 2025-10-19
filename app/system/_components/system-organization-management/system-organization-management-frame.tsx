import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Frame, FramePanel } from '@/components/ui/frame';

import {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
} from '../system-management-section';
import SystemOrganizationCreationDialog from './system-organization-creation-dialog';
import SystemOrganizationManagementTable from './system-organization-management-table';

const SystemOrganizationManagement = () => {
  return (
    <SystemManagementSection>
      <SystemManagementSectionHeader
        title="Organization Management"
        description="Manage organizations and their settings."
      >
        <SystemOrganizationCreationDialog>
          <Button variant="outline" size="sm">
            Add Organization <PlusIcon />
          </Button>
        </SystemOrganizationCreationDialog>
      </SystemManagementSectionHeader>
      <SystemManagementSectionPanel>
        <Frame>
          <FramePanel>
            <SystemOrganizationManagementTable />
          </FramePanel>
        </Frame>
      </SystemManagementSectionPanel>
    </SystemManagementSection>
  );
};

export default SystemOrganizationManagement;
