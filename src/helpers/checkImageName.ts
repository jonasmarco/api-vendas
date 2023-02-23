export default function checkImageName(imageName: string) {
  return /(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(imageName)
}
