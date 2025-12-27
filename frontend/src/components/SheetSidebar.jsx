import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import CartCard from './CartCard'
import fruitCategory from '@/assets/Category/fruitCategory.svg'
import vegeCategory from '@/assets/Category/vegeCategory.svg'
import meatCategory from '@/assets/Category/meatCategory.svg'
import snackCategory from '@/assets/Category/snackCategory.svg'
import bevrageCategory from '@/assets/Category/bevrageCategory.svg'
import breadCategory from '@/assets/Category/breadCategory.svg'
import needsCategory from '@/assets/Category/needsCategory.svg'
import cookCategory from '@/assets/Category/cookCategory.svg'

const SheetSidebar = ({ contentType, open, onOpenChange }) => {

  const CartDummy = [
    { id: 1, Pname: 'Apple', source: fruitCategory, category: "Fruit", price: 40, quantity: 10 },
    { id: 2, Pname: 'Banana', source: vegeCategory, category: "Vegetable", price: 50, quantity: 15 },
  ]

  return (
      <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent>
              <SheetHeader>
              <SheetTitle>Your {contentType}</SheetTitle>
              <SheetDescription>
                  This is your {contentType}
              </SheetDescription>
              </SheetHeader>
              {CartDummy.map((item) => <CartCard key={item.id} 
                  Pname={item.Pname} 
                  source={item.source} 
                  category={item.category} 
                  price={item.price} 
                  quantity={item.quantity}
                />)
              }
          </SheetContent>
      </Sheet>
  )
}

export default SheetSidebar
