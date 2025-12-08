const express = require('express')
const router = express.Router()
const multer = require('multer')
const response = require('../response')
const path = require('path')

//config storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"))
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + file.originalname
        cb(null, unique)
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024}, //max 2 mb
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
        if (!allowed.includes(file.mimetype)) {
            const err = new Error("Tipe file tidak diizinkan")
            err.status = 400
            return cb(err)
        }
        cb(null, true)
    }
})

router.get('/book/cover', (req, res) => {
    res.render("uploadCover")
})

router.post("/book/cover", upload.single("cover"), (req, res) => {
    if (!req.file) {
        return response(400, "cover wajib diupload", '-', res)
    }

    return response(201, "upload berhasil", req.file.filename, res)
})


module.exports = router