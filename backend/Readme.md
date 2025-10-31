# Backend Notes
## Note - 1 : Global error handling
#### Points to remember 
_AppError.js_
- `statusCode` is NOT native - It's a custom property you add for HTTP status codes
- `super(message)` - Calls the parent Error constructor with the message.
- `this.statusCode` - Adds a new property to your custom error class
- Separation of Concerns - Native Error handles stack traces, your class handles HTTP-specific data
- Operational vs Programming Errors - isOperational flag helps distinguish expected errors (404) from bugs (null reference)
- constructor - Runs automatically when you use new ClassName()
- Built in `Error` class have only three property. 
    - `message` - The error message (use -> error.message)
    - `name` - The error type (e.g., "Error", "TypeError")
    - `stack` - The stack trace
- `captureStackTrace(this, this.constructor)`
    - `this` - The error object being created
    - `this.constructor` - The AppError class itself
    - `Purpose`: Remove the constructor from the stack trace [Stack trace = list of function calls that led to the error] and Makes debugging easier by showing only relevant code

_Middleware: errorHandler.js_
`instanceof`:
- Checks object type - Is this error an instance of a specific class?
- Returns boolean - `true` or `false`
- Checks inheritance - `AppError instanceof Error` is true
- Use case: Distinguish between different error types
`error.code`:
- Not built-in - Added by libraries (MongoDB, system errors)
- Library-specific - MongoDB uses 11000 for duplicates
- Different from statusCode - statusCode is HTTP, code is error-specific
- Check the docs - Each library has its own properties while sending error

_Flow of error handling:_

`next(error)` Flow:
- `next()` without argument → Continue to next normal middleware
- `next(error)` with argument → Skip to error handler
- Express detects error by checking if argument exists
- Skips all normal middleware after error occurs
- Finds first middleware with 4 parameters (error handler)

Error Handler Requirements:
- Must have 4 parameters: `(err, req, res, next)`
- Must be registered last in app.js (after all routes)
- First parameter is the error object from `next(error)`
- Can have multiple handlers - they run in order

Best Practices:
- Always use try-catch in async routes
- Always call `next(error)` instead of throwing
- Put error handler last in middleware chain
- Use asyncHandler to avoid repetitive try-catch
- Log errors before sending response

---
