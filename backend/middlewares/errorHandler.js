import AppError from "../utils/AppError";

function globalErrorHandler( error, req, res, next) {
    console.error('Error', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamps: new Date.toISOString()
    })

    // Handle operational error
    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message
        })
    }

    // mongodb error
    if (error.name === 'ValidationError'){  // Occurs when data fails validation rules defined in your Mongoose schema.
        return res.status(400).json({
            success: false,
            error: 'Validation error:' + error.message
        })
    }

    if (error.name === 'CastError') {  // Occurs when Mongoose can't convert a value to the expected data type, most commonly with invalid ObjectIDs.
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        })
    }

    // Mongodb dublicate key error
    if(error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            error: `${field} already exists`
        });
    }

    // Handle JWT errors
    if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }

    if(error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token has expired'
        });
    }

    return res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Something went Wrong!' : error.message
    })

    
}

export default globalErrorHandler;