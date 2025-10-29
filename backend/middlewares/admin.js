
function adminOnly(req,res,next) {
    user = req.user;
    // console.log(user.role);
    if(!user){
        return res.status(401).json({
            success: false,
            message: 'Authentication is Required'
        })
    }
    if(user.role != 'admin'){
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to access this page'
        })
    };
    next();
}

export { adminOnly };