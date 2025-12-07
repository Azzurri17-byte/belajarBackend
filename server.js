const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const bookRouter = require('./routes/book')
const logger = require('./middleware/logger')
const cookieParser = require('cookie-parser')
const port = 3000
const errorHandler = require('./middleware/errorMiddleware')

app.use(logger)

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/book', bookRouter)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`listen in ${port}`)
})