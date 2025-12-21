import * as React from 'react';

import { cn } from '@/lib/utils';

type BaseProps = {
  title: string;
  description: string;
  className?: string;
};

type Props<C extends React.ElementType> = BaseProps & {
  as?: C;
} & Omit<
    React.ComponentPropsWithoutRef<C>,
    keyof BaseProps | 'as' | 'className'
  >;

function PlatformSectionHeader<C extends React.ElementType = 'div'>(
  props: Props<C>,
) {
  const { as, title, description, className, ...rest } =
    props as Props<React.ElementType>;
  const Comp = (as ?? 'div') as React.ElementType;

  return (
    <Comp className={cn('w-full', className)} {...rest}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Comp>
  );
}

export default PlatformSectionHeader;
