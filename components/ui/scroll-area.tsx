'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui-components/react/scroll-area';

import { cn } from '@/lib/utils';

function ScrollArea({
  className,
  children,
  orientation,
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  orientation?: 'horizontal' | 'vertical' | 'both';
}) {
  return (
    <ScrollAreaPrimitive.Root className="min-h-0" {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          'focus-visible:ring-ring focus-visible:ring-offset-background size-full overscroll-contain rounded-[inherit] transition-[box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          className,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation === 'both' ? (
        <>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </>
      ) : (
        <ScrollBar orientation={orientation} />
      )}
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'm-0.5 flex opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-100 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-1.5',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="bg-foreground/20 relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
