'use client';

import { useRef, useState, useTransition } from 'react';

import { PencilIcon } from 'lucide-react';

import AppAvatar from '@openhome-os/particles/app-avatar';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { updateProfilePicture } from '@/models/user/user-actions';

import { useUser } from '../../_layers/_providers/user-provider';

const MePage = () => {
  const { user, refresh } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!user) {
    return null;
  }

  const fullName = `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`;
  const joinedDate = format(new Date(user.created_at), 'MMMM yyyy');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    startTransition(async () => {
      try {
        await updateProfilePicture({
          userId: user.id,
          profilePicture: file,
        });
        refresh();
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Failed to update profile picture:', error);
        toast.error('Failed to update profile picture');
      }
    });

    // Reset file input
    event.target.value = '';
  };

  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={handleAvatarClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={isPending}
              className="group after:border-border/50 dark:after:bg-background/72 relative cursor-pointer rounded-full transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:rounded-full after:border after:bg-clip-padding disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="overflow-hidden rounded-full">
                <AppAvatar
                  name={fullName}
                  src={user.profile_picture_url}
                  width={80}
                  height={80}
                />
              </div>
              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
                  isHovering && !isPending
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
              >
                <PencilIcon className="size-6 text-white" />
              </div>
              {/* Loading Overlay */}
              {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/50">
                  <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{fullName}</h1>
            <p className="text-muted-foreground">Joined {joinedDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MePage;
