import { Separator as SeparatorPrimitive } from '@base-ui-components/react/separator';

import { cn } from './util/cn';

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "bg-border data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
