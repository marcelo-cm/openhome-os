import { Suspense } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';
import { DialogTrigger } from '@openhome-os/ui/dialog';

import { AddItemDialog } from '../_components/add-item-dialog';

const ClosetView = () => {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Items</h1>
        <Suspense>
          <AddItemDialog>
            <DialogTrigger
              render={
                <Button>
                  <PlusIcon />
                  Add Item
                </Button>
              }
            />
          </AddItemDialog>
        </Suspense>
      </div>

      <div className="text-muted-foreground">
        Your items will appear here. Start by adding your first one!
      </div>
    </div>
  );
};

export default ClosetView;
