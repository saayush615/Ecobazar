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

## Note - 2 : Models
#### Points to Remember 
_1. Why phone type is String instead of Number_
- **Leading zeros**: Phone numbers like 0123456789 would lose the leading zero if stored as a number (123456789)
- **International format**: Numbers like +1-234-567-8900 contain characters (+, -) that aren't valid in numbers
- **No arithmetic needed**: You never perform math operations on phone numbers (no adding, subtracting, etc.)
- **Consistent length**: Numbers can lose trailing zeros or have precision issues with very long phone numbers

_2. Why use function(){} instead of arrow function () => {}_
This is **critical** in Mongoose schemas! Arrow functions **don't work** here because of how `this` binding works:

- **Regular function**: `this` refers to the document being validated (the user object)
- **Arrow function**: `this` refers to the parent scope (likely `undefined` or the wrong object)

> **The gotcha**: Arrow functions inherit `this` from where they're defined, not where they're called. Mongoose needs to set `this` to the document at validation time, which only works with regular functions.
```js
// ✅ Works - regular function
required: function() {
    return this.role === 'buyer' && !this.googleId;
    // 'this' = the user document being saved
}

// ❌ Broken - arrow function
required: () => {
    return this.role === 'buyer' && !this.googleId;
    // 'this' = undefined or wrong context - can't access role/googleId!
}
```

_3. Understanding `this` in Mongoose Schemas_

- `this` = **the document being validated** - Refers to the specific user object being created/updated
- **Access to all fields** - Can read any field defined in the schema
- **Real-time data** - Gets the actual values being submitted
- **Context-aware** - Changes based on which document you're working with

_4. Schema Field Options Explained_

`required`:
- Makes field mandatory before saving
- Can be boolean: `required: true`
- Can be function: `required: function() { return this.role === 'buyer' }`
- **Error if missing**: Mongoose throws validation error

`unique`
- Prevents duplicate values across all documents
- Creates database index for faster lookups
- **Not validation** - It's a database constraint
- **Sparse index needed** when field can be null/undefined

`sparse`
- Only indexes documents that have this field
- Allows multiple documents with `null` or `undefined` for unique fields
- **Use case**: Optional unique fields (like `googleId` - not all users have it)
- **Without sparse**: Can't have more than one `null` value in unique field

`default`
- Sets value if none provided
- Can be static: `default: 'buyer'`
- Can be function: `default: Date.now`
- **Runs on creation** - Not on updates unless specified

`select: false`
- **Hides the field by default**: When you query users from the database (e.g., User.find()), the password field won't be included in the results automatically. This protects sensitive data from accidentally being exposed.

- **Requires explicit inclusion**: If you do need the password (like when verifying login credentials), you must explicitly request it using .select('+password'):
```js
// Without select - password NOT included
const user = await User.findOne({ email });

// With select - password IS included
const user = await User.findOne({ email }).select('+password');
```
- **Use it for sensitive data**: Apply `select: false` to any fields containing passwords, tokens, API keys, or other sensitive information that shouldn't be returned in API responses or general queries.

_5. Email Validation Regex Pattern_
```js
match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
```
Breaking Down the Regex:
`^` - Start of string (must match from beginning)

`\w+` - One or more word characters (letters, digits, underscore)

    Example: john, user123
`([\.-]?\w+)*` - Optional dots/hyphens followed by word characters, repeated

    - [\.-]? - Optional dot or hyphen
    - \w+ - Followed by word characters
    - * - Repeat 0 or more times
    - Example: john.doe, user-name123
`@` - Literal @ symbol (required)

`\w+` - Domain name (one or more word characters)

    Example: gmail, company
`([\.-]?\w+)*` - Optional subdomains

    Example: .mail, -service
`(\.\w{2,3})+` - Domain extension(s)

    \. - Literal dot (escaped)
    \w{2,3} - 2-3 word characters
    + - One or more times
    Example: .com, .co.uk
`$` - End of string (must match until end)

---

## Note- 3 : Express 5 changes
- **Express 5 Breaking Change**: The `app.use('*', ...)` syntax is no longer valid in Express 5. Use `app.use(...)` or `app.all('*', ...)` instead.

- **Middleware Order Matters**: The 404 handler must come after all your routes but before the error handler.

- **app.use() vs app.all()**:
    - `app.use()` - Catches any HTTP method, partial path matches
    - `app.all()` - Catches any HTTP method, exact path matches
- **Always add** `req.originalUrl` to help debugging which route was attempted. 

---