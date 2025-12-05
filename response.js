const response = (statusCode, message, data, res) => {
    res.status(statusCode).json({
        payload: {
            status_code: statusCode,
            message, 
            data
        }
    })
}

module.exports = response