import { FieldLabel } from '@openhome-os/ui/field';

import { cn } from './util/cn';

const AppFieldLabel = ({
  children,
  optional = false,
  className,
  ...props
}: React.ComponentProps<typeof FieldLabel> & { optional?: boolean }) => {
  return (
    <FieldLabel className={cn('w-full', className)} {...props}>
      {children}
      {optional && (
        <span className="text-muted-foreground/72 ml-auto text-xs font-normal">
          Optional
        </span>
      )}
    </FieldLabel>
  );
};

export default AppFieldLabel;
