const bcrypt = require('bcrypt');

async function setPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function checkPassword(givenPassword, hash){
    const isMatch = await bcrypt.compare(givenPassword, hash);
    return isMatch;
}

module.exports = { setPassword, checkPassword };