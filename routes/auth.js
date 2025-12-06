require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../connection')
const response = require('../response')
const secretkey = process.env.SECRET_KEY

router.use(express.urlencoded({ extended: true }))

router.get('/register', (req, res) => {
    res.render("register", {success: req.query.success, error: req.query.error})
})

router.get('/login', (req, res) => {
    res.render("login", {success: req.query.success, error: req.query.error})
})

router.post('/register', async (req, res) => {
    const {username, password} = req.body
    const role = req.body.role || "user"

    if (!username || !password) {
        return res.redirect('/auth/register?error=Username & password tidak boleh kosong')
    }
    db.query('SELECT * FROM users_1 WHERE username = ?', [username], (err, result) => {
        if (err) {
        return response(500, 'SERVER ERROR', '-', res)
        } 
        if (result.length > 0) {
        return res.redirect('/auth/register?error=Username sudah terdaftar')
        }
        })
    const hashedPassword = await bcrypt.hash(password, 10)
    const sql = 'INSERT INTO users_1 (username, password, role) VALUES (?, ?, ?)'
    db.query(sql, [username, hashedPassword, role], (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        // return response(201, 'Register Berhasil', result.insertId, res)
        return res.redirect('/auth/login?success=Register berhasil silahkan login')
    })
})

router.post('/login', (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.render('login', {error: "Username & Password wajib diisi"})
    }
    const sql = 'SELECT * FROM users_1 WHERE username = ?'
    db.query(sql, [username], async (err, result) => {
        if (err) {
            return res.render('login', {error: "Server error"})
        }
        if (result.length === 0) {
            return res.render('login', {error: "Username tidak ditemukan"})
        }
        const user = result[0]
        const passwordMatch = bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.render('login', {error: "Password salah"})
        }
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role, 
        }, secretkey, {expiresIn: "1h"})
        //proses menyimpan jwt ke cookie website secara otmatis
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000 //durasi menjadi 1 jam
        })
        return res.redirect('/book')
    })
})

module.exports = router
