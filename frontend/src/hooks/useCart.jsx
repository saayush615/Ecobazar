import React, { useContext } from 'react'
import { CardContent } from '@/components/ui/card'

export const useCart = () => {
  const context = useContext(CardContent);

  if(!context){
    throw new Error("useCart must be used within an cart provider");
  }

  return context;
}
