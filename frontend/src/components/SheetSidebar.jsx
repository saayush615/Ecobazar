import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
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

          <SheetFooter>
            <p>great content</p>
          </SheetFooter>
      </Sheet>
  )
}

export default SheetSidebar
