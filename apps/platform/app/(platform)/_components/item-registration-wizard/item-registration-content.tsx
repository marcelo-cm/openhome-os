'use client';

import { useWizard } from '@openhome-os/core/wizard/wizard-context';
import { Card, CardContent } from '@openhome-os/ui/card';

interface ItemRegistrationContentProps {
  description?: string;
}

export function ItemRegistrationContent({
  description = 'Fill in the details of your item.',
}: ItemRegistrationContentProps) {
  const { currentStep } = useWizard();

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {currentStep.label}
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </header>

      <Card variant="ring">
        <CardContent>{currentStep.content}</CardContent>
      </Card>
    </div>
  );
}
