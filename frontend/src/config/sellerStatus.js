const STATUS_CONFIG = {
    'Confirmed' : {
        buttonText: 'Start Processing',
        nextStatus: 'Processing'
    },
    'Processing' : {
        buttonText: 'Order Shipped',
        nextStatus: 'Shipped'
    },
    'Shipped' : {
        buttonText: 'Order Delivered',
        nextStatus: 'Delivered'
    },
    'Delivered' : {
        buttonText: 'Delivered',
        nextStatus: null
    },
    'Cancelled' : {
        buttonText: 'Cancelled',
        nextStatus: null
    }
}

export default STATUS_CONFIG;