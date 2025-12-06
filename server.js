const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const bookRouter = require('./routes/book')
const cookieParser = require('cookie-parser')
const port = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/book', bookRouter)
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`listen in ${port}`)
})