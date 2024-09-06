"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UseMutationResult } from "@tanstack/react-query";
import { PopoverClose } from "@radix-ui/react-popover";

// Update the interface to use generic types
interface DeleteConfirmationPopoverProps<TVariables = number> {
  title: string;
  mutation: UseMutationResult<unknown, unknown, TVariables, unknown>;
  children: React.ReactNode;
  id: TVariables;
}

export function DeleteConfirmationPopover<TVariables = number>({
  title,
  mutation,
  children,
  id,
}: DeleteConfirmationPopoverProps<TVariables>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <h4 className="font-medium mb-2">Delete {title}?</h4>
        <p className="text-sm text-muted-foreground mb-4">
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <PopoverClose asChild>
            <Button variant="outline">Cancel</Button>
          </PopoverClose>
          <Button
            variant="destructive"
            onClick={() => {
              mutation.mutate(id);
              setIsOpen(false);
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Yes, delete"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
