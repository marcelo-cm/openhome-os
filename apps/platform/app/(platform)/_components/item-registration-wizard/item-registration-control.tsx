'use client';

import { useWizard } from '@openhome-os/core/wizard/wizard-context';
import { Button } from '@openhome-os/ui/button';

export function ItemRegistrationControl() {
  const { back, next, isCurrentStepValid, isSubmitting, isFirstStep } =
    useWizard();

  return (
    <div className="flex w-full justify-between">
      <Button variant="outline" onClick={() => back()} disabled={isFirstStep}>
        Previous
      </Button>
      <Button
        disabled={!isCurrentStepValid || isSubmitting}
        onClick={() => next()}
      >
        Next
      </Button>
    </div>
  );
}
