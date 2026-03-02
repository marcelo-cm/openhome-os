import { useWizard } from '@openhome-os/core/wizard/wizard-context';
import AppSectionHeader from '@openhome-os/particles/app-section-header';
import { Card, CardContent } from '@openhome-os/ui/card';

const PersonalItemRegistrationContent = () => {
  const { currentStep } = useWizard();
  return (
    <div className="flex w-full flex-col gap-6">
      <AppSectionHeader
        title={currentStep.label}
        description="Fill in the details of your item"
      />
      <Card variant={'ring'}>
        <CardContent>{currentStep.content}</CardContent>
      </Card>
    </div>
  );
};

export default PersonalItemRegistrationContent;
