'use client';

import { Input as InputPrimitive } from '@base-ui-components/react/input';

import { cn } from '@/lib/utils';

function Input({
  className,
  size = 'default',
  ...props
}: Omit<InputPrimitive.Props, 'size'> & {
  size?: 'sm' | 'default' | 'lg' | number;
}) {
  return (
    <span
      data-slot="input-control"
      className={cn(
        'border-input bg-background ring-ring/24 has-focus-visible:border-ring has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 relative inline-flex w-full rounded-lg border bg-clip-padding text-base/5 shadow-xs transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] has-disabled:opacity-64 sm:text-sm dark:not-in-data-[slot=group]:bg-clip-border dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)] [&:has(:disabled,:focus-visible,[aria-invalid])]:shadow-none',
        className,
      )}
    >
      <InputPrimitive
        data-slot="input"
        className={cn(
          'placeholder:text-muted-foreground/64 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] outline-none',
          size === 'sm' &&
            'px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)]',
          size === 'lg' && 'py-[calc(--spacing(2)-1px)]',
          props.type === 'search' &&
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          props.type === 'file' &&
            'text-muted-foreground file:text-foreground file:me-3 file:bg-transparent file:text-sm file:font-medium',
        )}
        size={typeof size === 'number' ? size : undefined}
        {...props}
      />
    </span>
  );
}

export { Input };
