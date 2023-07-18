
const jwt = require('jsonwebtoken');

const creactjwtToken = (payload,key,expiresIn)=>{
    const token = jwt.sign(payload, key,{expiresIn});
    return token
}

module.exports = {creactjwtToken}


