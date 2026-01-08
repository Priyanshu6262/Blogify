// const { validateToken } = require('../services/authentication')

// function checkForAuthenticationCookie(cookieName) {
//     return (req, res, next) => {
//         const tokenCookieValue = req.cookies[cookieName]

//         // token nahi hai → sirf next() aur EXIT
//         if (!tokenCookieValue) {
//             return next()
//         }

//         try {
//             const userPayload = validateToken(tokenCookieValue)
//             req.user = userPayload
//         } catch (error) {
//             // invalid token → ignore user
//             req.user = null
//         }

//         return next()
//     }
// }

// module.exports = {
//     checkForAuthenticationCookie,
// }


const { validateToken } = require('../services/authentication')
const User = require('../models/user')

function checkForAuthenticationCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName]

    if (!tokenCookieValue) {
      req.user = null
      return next()
    }

    try {
      const payload = validateToken(tokenCookieValue)

      // 🔥 DB is source of truth
      const user = await User.findById(payload._id)

      if (!user) {
        req.user = null
        return next()
      }

      req.user = user   // ✅ fresh user from DB
    } catch (error) {
      req.user = null
    }

    return next()
  }
}

module.exports = {
  checkForAuthenticationCookie,
}
