const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const db = require('../connection')
const response = require('../response')

app.use(bodyParser.json())

app.get('/', (req, res) => {
    response(200, "ini data", "ini message", res)
})

app.get('/mahasiswa', (req, res) => {
    const sql = "SELECT * FROM mahasiswa1"
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "SUCCSESS", res)
    })
})

app.get('/mahasiswa/:nim', (req, res) => {
    const nim = req.params.nim
    const sql = `SELECT * FROM mahasiswa1 WHERE nim = ${nim}`
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "SUCCSESS", res)
    })
})

app.post('/mahasiswa', (req, res) => {
    const {nim, nama, prodi, alamat} = req.body
    
    // Gunakan placeholder (?) untuk keamanan dan otomatis handle tipe data
    const sql = `INSERT INTO mahasiswa1 (nim, nama, prodi, alamat) VALUES (?, ?, ?, ?)`
    
    db.query(sql, [nim, nama, prodi, alamat], (err, result) => {
        if (err) {
            console.error('Error:', err)
            return res.status(500).json({ 
                message: "Gagal menambah data", 
                error: err.message 
            })
        }
        
        res.status(200).json({ 
            message: "Data berhasil ditambahkan",
            insertId: result.insertId 
        })
    })
})

app.put('/mahasiswa', (req, res) => {
    const {nim, nama, prodi, alamat} = req.body
    const sql = `UPDATE mahasiswa1 SET nama = ?, prodi = ?, alamat = ? WHERE nim = ?`
    db.query(sql, [nama, prodi, alamat, nim], (err, fields) => {
        if (err) {
            console.log("error:", err)
            return res.status(500).json({
                message: "data tidak ditemukan",
                error: err.message
            })
        }
        if (fields.affectedRows == 0) {
            return response(404, err, "update data gagal", res)
        }
        response(200, fields.affectedRows, "data berhasil diupdate", res)
    })
})

app.delete('/mahasiswa', (req, res) => {
    const {nim, nama, prodi, alamat} = req.body
    const sql = "DELETE FROM mahasiswa1 WHERE nim = ?"
    db.query(sql, [nim], (err, fields) => {
        if (err) return response(500, "invalid", err, res)
        if (fields.affectedRows > 0) {
            response(200, fields.affectedRows, "berhasil menghapus data", res)
        } else {
            response(404, fields.affectedRows, "Data tidak ditemukan", res)
        }
    })
})

app.listen(port, () => {
    console.log(`https://localhost:${port}`)
})




// // app.get('/', (req, res) => {
// //     const sql = "SELECT * FROM mahasiswa2"
// //     db.query(sql, (error, result) => {
// //      response(200, result, "get all data from mahasiswa", res)
// //     })
// // })

// // app.get('/nim', (req, res) => {
// //     const sql = `SELECT nama_lengkap FROM mahasiswa2 WHERE nim = ${req.query.nim}`
// //     db.query(sql, (error, result) => {
// //         response(200, result, "find data mahasiswa name", res)
// //     })
// // })

// const express = require('express')
// const app = express()

// app.get('/', (req, res) => {
//     res.sendFile('response.js')
// })

// app.listen(3000)