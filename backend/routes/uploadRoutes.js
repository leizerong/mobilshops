import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

//创建磁盘存储引擎,开辟地址
const storage = multer.diskStorage({
  destination(req, file, cb) {
//存储的目录
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )//重命名//(file.originalname).jpg
  },
})

//验证文件类型
const checkFileType = (file, cb) => {
  //定义允许的文件扩展名
  const filtTypes = /jpg|jpeg|png/
  //判断文件扩展名//.jpg换为小写
  const extname = filtTypes.test(path.extname(file.originalname).toLowerCase())
  //验证资源的媒体类型
  const mimetype = filtTypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('仅限图片格式'))
  }
}

//上传文件，过滤格式
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

//创建文件上传路由single单个上传
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
