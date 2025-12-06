const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('../connection')
const path = require('path')

app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/home', (req, res) => {
    const sql = "SELECT * FROM expensetracker"
    db.query(sql, (err, result) => {
        res.render("home", {
            data: result
        })
    })
})

app.post('/home', (req, res) => {
    const {type, nominal, category, note, date} = req.body
    const sql = "INSERT INTO expensetracker (type, nominal, category, note, date) VALUES (?, ?, ?, ?, ?)"
    db.query(sql, [type, nominal, category, note, date], (err, result) => {
        if (err) {
            console.log("error: ", err)
            res.status(500).json({
                message: "terjadi kesalahan",
                error: err.message
            })
        }
        res.redirect('/home')
    })
})

app.get('/home/:id/edit', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM expensetracker WHERE id = ?'
    db.query(sql, [id], (err, result) => {
        res.render('edit-expense-tracker', {
            data: result
        })
    })
})

app.post('/home/:id/edit', (req, res) => {
    const id = req.params.id
    const {type, nominal, category, note, date} = req.body
    const sql = 'UPDATE expensetracker SET type = ?, nominal = ?, category = ?, note =?, date = ? WHERE id = ?'
    db.query(sql, [type, nominal, category, note, date, id], (err, result) => {
        if (err) {
            console.log("error:", err)
            return res.status(500).json({
                message: "terjadi kesalahan",
                error: err.message
            })
        }
        res.redirect('/home')
    })
})


app.post('/home/:id/delete', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM expensetracker WHERE id = ?`
    db.query(sql, [id], (err, result) => {
        if(err) {
            console.log('error: ', err)
            return res.status(500).json({
                message: "terjadi kesalahan",
                error: err.message
            })
        }
        res.redirect('/home')
    })
})




app.listen(3000)

