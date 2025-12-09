const express = require('express')
const router = express.Router()
const multer = require('multer')
const response = require('../response')
const path = require('path')
const fs = require('fs')


//otomatis membuat folder uploads jika tidak ada
const uploadDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

//config storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        //sanitize filename: hapus karakter berbahaya
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
        const ext = path.extname(sanitized)
        const basename = path.basename(sanitized, ext)
        const unique = `${Date.now()}-${basename}-${ext}`
        cb(null, unique)
    }
});

//file filter error
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["images/jpg", "images/png", "images/webp", "images/jpeg"]
    const allowedExts = [".jpg", ".jpeg", ".png", ".webp"]
    const ext = path.extname(file.originalname).toLocaleLowerCase()

    if(!allowedTypes.includes(file.mimetype) || !allowedExts.includes(ext)) {
        const err = new Error(`Tipe file tidak diizinkan. Hanya menerima: ${allowedExts.join(', ')}`)
        err.status = 400
        return cb(err, false)
    } 
    cb(null, true)
}

const upload = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024, //max 2 mb
        files: 1
    }, 
    fileFilter
})

//error handler for multer
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return response(400, "File terlalu besar. Maksimal 2MB", null, res)
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return response(400, "Terlalu banyak file atau fieldname salah", null, res)
        }
    }

    if (err) {
        return response(err.status || 500, err.message, null, res)
    }
    next()
}

//router get untuk render form upload
router.get('/book/cover', (req, res) => {
    res.render("uploadCover")
})

router.post("/book/cover", (req, res, next) => {
    upload.single("cover"), (req, res, err) => {
        if (err) {
            return multerErrorHandler(err, req, res, next)
        }

        if(!req.file) {
            return response(400, "Cover wajib diupload", null, res)
        }

        //Response dengan detail file
        const fileData = {
            fileName: req.file.fileName,
            originalName: req.file.originalName,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: `/uploads/${req.file.fileName}` // url untuk akses file
        }
        return response(201, "Upload berhasil", fileData, res)
    }
})


module.exports = router