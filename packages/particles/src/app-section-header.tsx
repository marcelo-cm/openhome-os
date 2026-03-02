'use client';

import type { ElementType } from 'react';

interface AppSectionHeaderProps {
  title: string;
  description: string;
  href?: string;
  as?: ElementType;
}

function HeaderContent({
  title,
  description,
}: Pick<AppSectionHeaderProps, 'title' | 'description'>) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

const AppSectionHeader = ({
  title,
  description,
  href,
  as: Component,
}: AppSectionHeaderProps) => {
  if (Component) {
    return (
      <Component href={href} className="block">
        <HeaderContent title={title} description={description} />
      </Component>
    );
  }

  return <HeaderContent title={title} description={description} />;
};

export default AppSectionHeader;
