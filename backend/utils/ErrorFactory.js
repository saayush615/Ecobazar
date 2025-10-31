import AppError from "./AppError.js";

// factory functions for common errors
export const createValidationError = (message = 'Validation failed') => 
    new AppError(message, 400);

export const createNotFoundError = (resource = 'Resource') => 
    new AppError(`${resource} not found`, 404);

export const createUnauthorizedError = (message = 'Authentication required') =>
    new AppError(message,401);

export const createForbiddenError = (message = 'Access forbidden') =>
    new AppError(message, 403);

export const createDuplicateError = (field = 'Item') =>
    new AppError(`${field} already exists`, 400);

export const createFileUploadError = (message = 'File upload failed') => 
    new AppError(`File upload error: ${message}`, 400);
