import mime from 'mime'

export default function checkImageType(imageName: string): boolean {
  const mimetype = mime.getType(imageName)

  return mimetype ? mimetype.startsWith('image/') : false
}
