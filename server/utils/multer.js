const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(req.originalUrl.includes('found')){
        cb(null, './public/img/found/')
      }
      else{
        cb(null, './public/img/lost/')
      }
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split('.')
        ext = ext[ext.length - 1]

        const filename = uuidv4() + '.' + ext
        cb(null, filename)
    }
  })

const upload = multer({storage: storage})

module.exports = upload