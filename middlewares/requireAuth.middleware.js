const logger = require('../services/logger.service')
const userService = require('../api/user/user.service')
const projService = require("../api/proj/proj.service");

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized!')
    return
  } 
  next()
}


async function requireAdmin(req, res, next) {
  const user = req.session.user
  if (!user.isAdmin) {
    logger.warn(user.fullname + ' Attempt to perform admin action')
    res.status(403).end('Unauthorized Enough..')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
