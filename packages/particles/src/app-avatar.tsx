import Image, { ImageProps } from 'next/image';

import { cn } from './util/cn';

interface AppAvatarProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt?: string | null;
  name: string;
}

const AppAvatar = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: AppAvatarProps) => {
  const name = props.name?.trim() || '';

  const nameParts = name.split(' ').filter(Boolean);

  let initials = '';
  if (nameParts.length === 1) {
    // Single name → 1 initial
    initials = nameParts[0]?.[0] || '';
  } else if (nameParts.length > 1) {
    // Multiple names → first two initials
    initials = nameParts[0]?.[0] || '' + nameParts[1]?.[0] || '';
  }

  initials = initials.toUpperCase();

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-300 font-semibold text-white',
          className,
        )}
        style={{
          width,
          height,
          fontSize: Math.min(Number(width), Number(height)) / 2.5,
        }}
        {...props}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? name}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
};

export default AppAvatar;
