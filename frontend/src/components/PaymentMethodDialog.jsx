import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, HandCoins } from 'lucide-react'

const PaymentMethodDialog = ({ open, onOpenChange, loading }) => {
  
  const paymentMethods = [
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Pay using Card, UPI, Net Banking, or Wallets',
      icon: CreditCard,
      color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: HandCoins,
      color: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how you'd like to pay for your order
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 mt-4'>
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                // onClick={() => }
                disabled={loading}
                className={`w-full p-4 border-2 rounded-lg transition-all duration-200 flex items-start gap-4 ${method.color} hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`p-3 rounded-full bg-white dark:bg-gray-800 ${method.iconColor}`}>
                  <Icon className='w-6 h-6' />
                </div>
                <div className='flex-1 text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    {method.name}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {method.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className='mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
          <p className='text-xs text-yellow-800 dark:text-yellow-200'>
            💡 <strong>Note:</strong> COD orders may have additional delivery charges
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentMethodDialog