const errorHandler = (err, req, res, next) => {
    console.log(err.stack) //log error ke terminal

    const statusCode = err.status || 500
    const message = err.message ||  "server internal error"

    res.status(statusCode).json({
        success: false,
        error: message
    })
}

module.exports = errorHandler