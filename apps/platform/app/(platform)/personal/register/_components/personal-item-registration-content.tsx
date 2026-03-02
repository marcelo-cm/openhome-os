import { useWizard } from '@openhome-os/core/wizard/wizard-context';

import PlatformSectionHeader from '@/app/(platform)/_components/platform-section-header';

const PersonalItemRegistrationContent = () => {
  const { currentStep } = useWizard();
  return (
    <div className="flex w-full flex-col gap-8">
      <PlatformSectionHeader
        title={currentStep.label}
        description="Fill in the details of your item"
      />
      {currentStep.content}
    </div>
  );
};

export default PersonalItemRegistrationContent;
