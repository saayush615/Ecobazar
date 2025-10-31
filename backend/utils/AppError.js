class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational; // Distinguishes operational vs programming errors

        // Capture stack trace, excluding this constructor
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;