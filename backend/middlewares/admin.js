
function adminOnly(req,res,next) {
    user = req.user;
    // console.log(user.role);
    if(!user) return res.redirect('/login');
    if(user.role != 'admin') return res.end('You are not authorized to access this page');
    next();
}

module.exports = { adminOnly };