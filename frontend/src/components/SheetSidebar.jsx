import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const SheetSidebar = ({ content, open, onOpenChange }) => {
  return (
      <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent>
              <SheetHeader>
              <SheetTitle>Your {content}</SheetTitle>
              <SheetDescription>
                  This is your {content}
              </SheetDescription>
              </SheetHeader>
          </SheetContent>
      </Sheet>
  )
}

export default SheetSidebar
