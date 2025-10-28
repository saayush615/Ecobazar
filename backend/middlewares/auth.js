import { checkToken } from '../services/auth.js';

async function checkAuthentication(req,res,next) {
    const userUid = req.cookies?.uid;

    // Set default user to null
    req.user = null;

    // If no token exists, move to next middleware
    if(!userUid){
        return next();
        // Immediately exits the middleware function
        // Ensures only one response is sent
        // Prevents any code after it from executing
        // Maintains clear control flow
    }
    const user = checkToken(userUid);
    if(!user){
        return next();
    }

    req.user = user;
    return next();

}

export { checkAuthentication };