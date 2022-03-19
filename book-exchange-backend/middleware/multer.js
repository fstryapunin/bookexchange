const path = require('path');
const multer = require('multer');
const {appRoot} = require('../config.js')

//get root path from config
const uploadPath = path.join(appRoot, 'public', 'uploads')


//configure writing files to disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniquePrefix = `${req.user?.id}_${Date.now()}_${Math.round(Math.random() * 1E9)}`  
        cb(null, uniquePrefix + '_' + file.originalname)
    }
})


//do not allow uploading anything but jpeg and png
const fileFilter = (req, file, cb) => {     
    if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {        
        return cb(null, true)
    }
    else {         
        cb(new Error("WRONG_FILE_TYPE"), false)
    }  
}

//consfigure multer uploader object
const multerUploader = multer({
    storage: storage,
    limits: {fileSize : 5242880},
    fileFilter: fileFilter,   
})

module.exports = {
    multerUploader: multerUploader  
}
