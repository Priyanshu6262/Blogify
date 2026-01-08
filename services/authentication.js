const JWT = require("jsonwebtoken")

const secret = "$bhupender_jogi@123"

// Ek user object ke kar uska Token generet kare ga
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
    }
    const token = JWT.sign(payload, secret)
    return token
}

// Validetion for Tokens
function validateToken(token) {
    const payload = JWT.verify(token, secret)
    return payload
}

module.exports = {
    createTokenForUser,
    validateToken,
}