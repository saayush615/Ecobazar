import { createUnauthorizedError, createForbiddenError } from '../utils/ErrorFactory.js'

function sellerOnly(req,res,next) {
    const user = req.user;
    // console.log(user.role);
    if(!user){
        return next(createUnauthorizedError())
    }
    if(user.role != 'seller'){
        return next(createForbiddenError())
    };
    next();
}

function buyerOnly(req,res,next) {
    const user = req.user;
    if(!user){
        return next(createUnauthorizedError())
    }
    if(user.role != 'buyer'){
        return next(createForbiddenError())
    };
    next();
}

export { sellerOnly };