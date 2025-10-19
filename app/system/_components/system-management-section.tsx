import { HtmlHTMLAttributes } from 'react';

import { ChevronDown } from 'lucide-react';

import { Collapsible } from '@base-ui-components/react/collapsible';

import { CardDescription } from '@/components/ui/card';
import {
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { cn } from '@/lib/utils';

const SystemManagementSection = ({
  children,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <Collapsible.Root data-slot="system-management-section">
      <div className="flex flex-col gap-4" {...props}>
        {children}
      </div>
    </Collapsible.Root>
  );
};

const SystemManagementSectionHeader = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      data-slot="system-management-section-header"
      className={cn(
        'flex items-start',
        children ? 'justify-between' : 'justify-start',
        className,
      )}
    >
      <CollapsibleTrigger className={'group/section-trigger text-left'}>
        <div>
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4 transition-[rotate] duration-300 group-data-[panel-open]/section-trigger:-rotate-180" />
            <p className="font-semibold">{title}</p>
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
      </CollapsibleTrigger>
      {children}
    </div>
  );
};

const SystemManagementSectionPanel = ({
  ...props
}: Collapsible.Panel.Props) => {
  return (
    <CollapsiblePanel data-slot="system-management-section-panel" {...props} />
  );
};

export {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
};
