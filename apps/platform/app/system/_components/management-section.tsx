import { HtmlHTMLAttributes } from 'react';

import { ChevronDown } from 'lucide-react';

import { CardDescription } from '@openhome-os/ui/card';
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@openhome-os/ui/collapsible';
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from '@openhome-os/ui/tooltip';

import { cn } from '@/lib/utils';

const SystemManagementSection = ({
  children,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <Collapsible data-slot="system-management-section">
      <div className="flex flex-col gap-4" {...props}>
        {children}
      </div>
    </Collapsible>
  );
};

const SystemManagementSectionHeader = ({
  title,
  description,
  info,
  children,
  className,
}: {
  title: string;
  description: string;
  info?: string;
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className={'cursor-pointer font-semibold'}
                  render={<span />}
                >
                  {title}
                </TooltipTrigger>
                {info && (
                  <TooltipPopup align="start" alignOffset={-32}>
                    {info}
                  </TooltipPopup>
                )}
              </Tooltip>
            </TooltipProvider>
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
}: React.ComponentProps<typeof CollapsiblePanel>) => {
  return (
    <CollapsiblePanel data-slot="system-management-section-panel" {...props} />
  );
};

export {
  SystemManagementSection,
  SystemManagementSectionHeader,
  SystemManagementSectionPanel,
};
