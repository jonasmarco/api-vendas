import path from 'path'
import multer, { StorageEngine } from 'multer'
import crypto from 'crypto'

interface IUploadConfig {
  driver: 'disk' // | another like s3,
  tmpFolder: string
  directory: string
  multer: {
    storage: StorageEngine
  }
}

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')
const tmpFolder = path.resolve(__dirname, '..', '..', 'temp')

export default {
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex')

        const filename = `${fileHash}-${file.originalname}`

        callback(null, filename)
      }
    })
  }
} as IUploadConfig
