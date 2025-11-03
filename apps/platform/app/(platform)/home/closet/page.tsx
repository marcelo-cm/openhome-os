'use client';

import React, { useState } from 'react';

import { PlusIcon } from 'lucide-react';

import { Button } from '@openhome-os/ui/button';

import { AddItemDialog } from './_components/add-item-dialog';

const ClosetPage = () => {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Closet</h1>
        <Button onClick={() => setIsAddItemDialogOpen(true)}>
          <PlusIcon />
          Add Item
        </Button>
      </div>

      <div className="text-muted-foreground">
        Your clothing items will appear here. Start by adding your first item!
      </div>

      <AddItemDialog
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
      />
    </div>
  );
};

export default ClosetPage;
