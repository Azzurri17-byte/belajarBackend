require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../connection')
const response = require('../response')
const secretkey = process.env.SECRET_KEY


router.post('/register', async (req, res) => {
    const {username, password} = req.body
    const role = req.body.role || "user"
    if (!username || !password) {
        return response(401, "username & password wajib diisi", null, res)
    }
    db.query('SELECT * FROM users_1 WHERE username = ?', [username], (err, result) => {
        if (err) {
        return response(500, 'SERVER ERROR', null, res)
        } 
        if (result.length > 0) {
        return response(401, "username sudah terdaftar", null, res)
        }
        })
    const hashedPassword = await bcrypt.hash(password, 10)
    const sql = 'INSERT INTO users_1 (username, password, role) VALUES (?, ?, ?)'
    db.query(sql, [username, hashedPassword, role], (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        return response(201, 'Register Berhasil', result.insertId, res)
    })
})

router.post('/login', (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return response(401, "username & Password wajib diisi", null, res)
    }
    const sql = 'SELECT * FROM users_1 WHERE username = ?'
    db.query(sql, [username], async (err, result) => {
        if (err) {
            return response(500, "SERVER ERROR", null, res)
        }
        if (result.length === 0) {
            return response(404, "username tidak ditemukan", null, res)
        }
        const user = result[0]
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.render('login', {error: "Password salah"})
        }
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role, 
        }, secretkey, {expiresIn: "1h"})
        return response(200, "Login berhasil", {token}, res)
    })
})

module.exports = router
