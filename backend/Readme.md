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
match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email']
```
Breaking Down the Regex:
`^` - Start of string (must match from beginning)

`[A-Z0-9._%+-]+` - Allows alphanumeric, dots, underscores, %, +, -

    supports: user+tag@gmail.com
`@` - Literal @ symbol (required)

`[A-Z0-9.-]+` - Domain can have alphanumeric, dots, hyphens

    supports: mail.google.com
`\.` - Literal dot before TLD(Top-Level Domain)

`[A-Z]{2,}` - TLD must be at least 2 chars(covers .co, .com, .info, .museum)

`$` - End of string (must match until end)

`i` - Case-insensitive flag

---

## Note- 3 : Express 5 changes
- **Express 5 Breaking Change**: The `app.use('*', ...)` syntax is no longer valid in Express 5. Use `app.use(...)` or `app.all('*', ...)` instead.

- **Middleware Order Matters**: The 404 handler must come after all your routes but before the error handler.

- **app.use() vs app.all()**:
    - `app.use()` - Catches any HTTP method, partial path matches
    - `app.all()` - Catches any HTTP method, exact path matches
- **Always add** `req.originalUrl` to help debugging which route was attempted. 

---

## Note 4 : Mongoose Documents vs Plain Objects

```js
// Mongoose Document (what req.user is)
{
  _id: ObjectId('...'),
  name: 'Aayush singh',
  email: 'saayush615@gmail.com',
  // + 50+ internal Mongoose properties/methods
  $__: {...},           // Internal state
  $isNew: false,        // Tracking flag
  toObject: [Function], // Methods
  save: [Function],
  // etc.
}

// Plain Object (what JWT needs)
{
  id: '691df359e99b05a6d59ead8e',
  role: 'buyer'
}
```
> JWT can't serialize **Mongoose's internal properties**, hence the error.

---
## Note 5:  Optional Chaining Operator (`?.`)
#### What It Does
The optional chaining operator (`?.`) allows you to safely access nested object properties without throwing an error if any intermediate value is `null` or `undefined`.
#### Syntax Examples
```js
// 1. Property Access
obj?.property          // Returns undefined if obj is null/undefined
obj?.property?.nested  // Chains multiple levels safely

// 2. Array Access
arr?.[0]              // Returns undefined if arr is null/undefined
arr?.[index]?.value   // Combines array + property access

// 3. Function Call
obj?.method()         // Only calls if obj exists
obj?.method?.()       // Only calls if method exists

// 4. Complex Chaining
user?.profile?.address?.city  // Stops at first null/undefined
// If any part is null/undefined → returns undefined
// If all parts exist → returns the final value
```
#### Key Points to Remember
**1. Returns `undefined`, Not Error**
```js
const user = null;

// ❌ Without ?.  → TypeError: Cannot read property 'name' of null
const name = user.name;

// ✅ With ?.  → undefined (no error)
const name = user?.name;
```
**2. Stops at First `Null/Undefined`**
```js
const user = {
    profile: null
};

// Stops at profile (which is null), returns undefined
const city = user?.profile?.address?.city;
// Doesn't try to access address.city
```
**3. Works with Arrays**
```js
const emails = undefined;

// ❌ emails[0] → TypeError
// ✅ emails?.[0] → undefined

const firstEmail = emails?.[0]?.value;
```
**4. Combine with Nullish Coalescing (??)**
```js
// Provide default values
const email = profile.emails?.[0]?.value ?? 'no-email@example.com';
const port = process.env.PORT ?? 3000;

// Note: ?? only triggers for null/undefined, not for 0, '', false
const count = 0 ?? 10;        // 0 (not 10)
const count = undefined ?? 10; // 10
```
**5. Not the Same as Default Parameters**
```js
// Function default parameter
function greet(name = 'Guest') {
    // name is 'Guest' if undefined/not provided
}

// Optional chaining
const greeting = user?.name;  // undefined if user doesn't exist
```
#### Reference Cheat Sheet
```js
// Property access
obj?.prop              // obj.prop if obj exists, else undefined
obj?.[expr]            // Dynamic property access

// Array access  
arr?.[0]               // arr[0] if arr exists
arr?.[index]?.value    // Nested array + property

// Function calls
obj?.method()          // Call only if obj exists
obj?.method?.()        // Call only if method exists

// With defaults
value ?? defaultValue  // Use default if value is null/undefined
value || defaultValue  // Use default if value is falsy (includes 0, '')

// Combined
profile.emails?.[0]?.value ?? 'no-email@example.com'
```
---
## Note-6 : oAuth (passportjs)

#### Step 1: User Clicks "Login with Google" Button
**File**: Login.jsx
function: `handleGoogleOauth`
**What happens**:
- User clicks the Google button
- Browser redirects to your backend route: http://localhost:3000/oauth/google
- This is a _full page redirect_, not an AJAX call

#### Step 2: Backend Initiates OAuth with Google
**File**: oauth.js
```js
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile','email'] 
    })
)
```
**What happens**:
- Passport intercepts this route
- Passport redirects the user to Google's login page
- URL looks like: https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_ID&redirect_uri=...
- User sees Google's actual login interface

#### Step 3: User Logs in on Google
**Platform**: Google's servers (not your app)
**Google asks**: "Allow [Your App] to access your profile and email?"

#### Step 4: Google Redirects Back with Authorization Code
**What happens**:
- Google redirects back to your callback URL: `http://localhost:3000/oauth/google/callback?code=AUTHORIZATION_CODE`
- This code is a temporary token (valid for ~10 minutes)
- Your app hasn't authenticated the user yet - you just have a code

#### Step 5: Passport Exchanges Code for User Profile
**File**: oauth.js - /google/callback route
```js
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
        session: false
    }),
    async function(req, res) {
        // This function runs AFTER Passport gets user info
    }
)
```
- Passport receives the authorization code from Google
- Passport makes a server-to-server request to Google's token endpoint:
- Google responds with an access token:
- Passport uses the access token to fetch user profile:
- Google returns user profile data:
- Passport calls your **verify function** (the strategy you defined)

#### Step 6: Your Strategy Function Processes User Data
**File**: passport.js
**What happens**:

- Passport passes `profile` object (from Google) to your function
- You check if user exists in your database
- If exists: return existing user
- If not: create new user
- Call `done(null, user)` - _this attaches user to `req.user`_

Step 7: Callback Route Receives Authenticated User
**File**: oauth.js
```js
router.get('/google/callback', 
    passport.authenticate('google', {...}),
    async function(req, res) {
        // ⭐ req.user is NOW AVAILABLE here
        // req.user = the Mongoose user document you returned in done(null, user)
        
        // req.user contains:
        // {
        //   _id: ObjectId('...'),
        //   name: 'John Doe',
        //   email: 'user@gmail.com',
        //   googleId: '1234567890',
        //   authProvider: 'google',
        //   role: 'buyer',
        //   createdAt: ...,
        //   updatedAt: ...,
        //   // + 50+ Mongoose internal properties
        // }
        
        const token = createToken({ 
            id: req.user._id,
            role: req.user.role 
        });
        
        res.cookie('uid', token, {...});
        res.redirect(`${process.env.FRONTEND_URL}/?auth=google_success`);
    }
);
```
**Where does** `req.user` **come from?**

- **Passport attaches** it after your verify function calls `done(null, user)`
- It's the **exact user object** you returned from your database
- It's a **full Mongoose document** with all methods and properties

#### Step 8: Create JWT and Set Cookie
#### Step 9: Redirect Back to Frontend
#### Step 10: Frontend Verifies Authentication
**File**: AuthContext.jsx

---
