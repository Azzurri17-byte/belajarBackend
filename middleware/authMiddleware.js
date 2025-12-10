require('dotenv').config()
const jwt = require('jsonwebtoken')
const response = require('../response')
const secretkey = process.env.SECRET_KEY

const verifyToken = (roles = []) => {
    return (req, res, next) => {
        const authHeaders = req.headers.authorization
        if (!authHeaders) {
            return response(404, "token tidak ditemukan", null, res)
        }
        const token = authHeaders.split(" ")[1]
        jwt.verify(token, secretkey, (err, decode) => {
            if (err) {
                return response(404, "Token invalid/expired", null, res)
            }
            if (roles.length && !roles.includes(decode.role)) {
                return response(401, "akses ditolak", null, res)
            }
            req.role = decode
            next()
        })
    }
}


module.exports = verifyToken