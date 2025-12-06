require('dotenv').config()
const jwt = require('jsonwebtoken')
const response = require('../response')
const secretkey = process.env.SECRET_KEY

const verifyToken = (roles = []) => {
    return (req, res, next) => {
        //token dari cookie web
        let token = req.cookies.token
        
    //kalau gaada token di cookie web, coba ambil di postman    
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization
        token = authHeader.split(" ")[1]
    }

    if (!token) {
        //kalau request dari browser ambil pakai redirect
        if (req.originalUrl.startWith("/auth")) {
            return res.redirect('/auth/login')
        }
        //kalau request via postman kirim ini
        return response(404, 'token tidak ditemukan', '-', res)
    }

    try {
          const decoded = jwt.verify(token, secretkey)
            if(roles.length > 0 && !roles.includes(decoded.role)) {
                return response(403, 'Akses ditolak!!', '-', res)
            }
            req.user = decoded
            next()
        } catch {
            return response(401, "token invalid/expired", '-', res)
        }
    }
}


module.exports = verifyToken