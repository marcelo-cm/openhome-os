/* eslint-disable react-hooks/rules-of-hooks */
import { ChevronRight } from '@hugeicons-pro/core-solid-rounded';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@openhome-os/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@openhome-os/ui/collapsible';
import { useStore } from '@tanstack/react-form';

import { useWizard } from './wizard-context';

const WizardDevTool = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const { form } = useWizard();

  const store = useStore(form.store);
  const { errors } = store;

  return (
    <Collapsible>
      <CollapsibleTrigger
        className={'flex w-full items-center justify-between gap-2'}
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ChevronRight}
            size={16}
            className="text-muted-foreground/72 transition-[rotate] duration-100 group-data-panel-open/collapsible-trigger:rotate-90"
          />
          <p className="text-muted-foreground/72 text-sm font-medium">
            Form Errors
          </p>
        </div>
        <Badge variant="outline">DEV</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={
          'bg-muted/32 text-muted-foreground/72 mt-2 rounded-md border border-dashed'
        }
      >
        <div className="p-4">
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default WizardDevTool;
