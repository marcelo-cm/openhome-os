import { useCallback, useEffect, useState } from 'react';

interface UseRemoteTriggerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface RemoteTriggerProps extends UseRemoteTriggerProps {
  children?: React.ReactNode;
}

/**
 * Hook to control dialogs, sheets, and other components that can be triggered by open states or on the click of a trigger.
 *
 * @example
 * ```tsx
 * const [isOpen, handleOpenChange] = useRemoteTrigger({
 *   open,
 *   onOpenChange
 * });
 *
 * return (
 *  <Dialog open={isOpen} onOpenChange={handleOpenChange}>
 *   {children && <DialogTrigger>{children}</DialogTrigger>}
 *   <DialogContent>
 *      ...
 *   </DialogContent>
 * </Dialog>
 * );
 * ```
 */
export const useRemoteTrigger = ({
  open,
  onOpenChange,
}: UseRemoteTriggerProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  return [isOpen, handleOpenChange] as const;
};
