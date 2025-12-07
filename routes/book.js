const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const db = require('../connection')
const response = require('../response')
const verifyToken = require('../middleware/authMiddleware')

router.use(bodyParser.json())

router.get('/', verifyToken(["admin", "user"]), (req, res) => {
    const sql = 'SELECT * FROM book_db'
    db.query(sql, (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        return res.render('book', {list: result, user: req.user})
    })
})

//route get khusus admin
router.get('/admin', verifyToken(["admin"]), (req, res) => {
    const sql = 'SELECT * FROM book_db'
    db.query(sql, (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        return response(200, 'List buku', result, res)
    })
})


router.get('/:title', verifyToken(['admin', 'user']), (req, res) => {
    const title = req.params.title
    const sql = 'SELECT * FROM book_db WHERE title LIKE ?'
    db.query(sql, [`%${title}%`], (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        if (result.length === 0) {
            return res.render('book', {list: result, message: "judul tidak ditemukan"})
        }
        return res.render('book', {list: result, user: req.user})
    })
})

// router.get('/author/:author', verifyToken(['admin', 'user']), (req, res) => {
//     const author = req.params.author
//     const sql = 'SELECT * FROM book_db WHERE author LIKE ?'
//     db.query(sql, [`%${author}%`], (err, result) => {
//         if (err) {
//             return response(500, 'SERVER ERROR', '-', res)
//         }
//         if (result.length === 0) {
//             return response(404, 'Author tidak ditemukan', '-', res)
//         }
//         return response(200, 'List buku', result, res)
//     })
// })

router.post('/admin', verifyToken(["admin"]), (req, res) => {
    const {title, author} = req.body
    const sql = 'INSERT INTO book_db (title, author) VALUES (?, ?)'
    db.query(sql, [title, author], (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        return response(201, 'Berhasil ditambahkan', result.insertId, res)
    })
})

router.put('/admin/:id', verifyToken(["admin"]), (req, res) => {
    const {title, author} = req.body
    const id = req.params.id
    const sql = 'UPDATE book_db SET title = ?, author = ? WHERE id = ?'
    db.query(sql, [title, author, id], (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        if (result.affectedRows === 0) {
            return response(404, 'buku tidak ditemukan', '-', res)
        }
        return response(201, 'Berhasil mengubah data buku', result.affectedRows, res)
    })
})

router.delete('/admin/:id', verifyToken(["admin"]), (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM book_db WHERE id = ?'
    db.query(sql, [id], (err, result) => {
        if (err) {
            return response(500, 'SERVER ERROR', '-', res)
        }
        if (result.affectedRows > 0) {
            return response(200, 'Buku berhasil dihapus', result.affectedRows, res)
        } else {
            return response(404, 'Buku tidak ditemukan', '-', res)
        }
    })
})

module.exports = router
