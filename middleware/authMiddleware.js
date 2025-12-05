require('dotenv').config()
const jwt = require('jsonwebtoken')
const response = require('../response')
const secretkey = process.env.SECRET_KEY

const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization
        if(!authHeader) {
            return response(401, 'token tidak ditemukan', '-', res)
        }
        const token = authHeader.split(" ")[1]
        jwt.verify(token, secretkey, (err, decode) => {
            if (err) {
                return response(401, 'token invalid/expired', '-', res)
            }
            if (roles.length > 0 && !roles.includes(decode.role)) {
                return response(403, 'akses ditolak', '-', res)
            }
            req.user = decode
            next()
        })
    }
}

module.exports = verifyToken