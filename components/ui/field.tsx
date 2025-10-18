'use client';

import { Field as FieldPrimitive } from '@base-ui-components/react/field';

import { cn } from '@/lib/utils';

function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn('flex flex-col items-start gap-2', className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn('inline-flex items-center gap-2 text-sm/4', className)}
      {...props}
    />
  );
}

function FieldControl({
  className,
  size = 'default',
  ...props
}: Omit<FieldPrimitive.Control.Props, 'size'> & {
  size?: 'sm' | 'default' | 'lg' | number;
}) {
  if (props.render) {
    return <FieldPrimitive.Control data-slot="field-control" {...props} />;
  }

  return (
    <span
      data-slot="field-control"
      className={cn(
        'border-input ring-ring/24 has-focus-visible:border-ring has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 relative inline-flex w-full rounded-lg border bg-transparent bg-clip-padding text-base/5 shadow-xs transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:ring-[3px] has-disabled:opacity-64 sm:text-sm dark:not-in-data-[slot=group]:bg-clip-border dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)] [&:has(:disabled,:focus-visible,[aria-invalid])]:shadow-none',
        className,
      )}
    >
      <FieldPrimitive.Control
        data-slot="field-control"
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
        {...props}
      />
    </span>
  );
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn('text-muted-foreground text-xs', className)}
      {...props}
    />
  );
}

function FieldError({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn('text-destructive-foreground text-xs', className)}
      {...props}
    />
  );
}

const FieldValidity = FieldPrimitive.Validity;

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
};
