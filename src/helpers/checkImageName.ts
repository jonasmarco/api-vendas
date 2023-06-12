export default function checkImageName(imageName: string): boolean {
  const imageExtensions = ['jpg', 'gif', 'png', 'jpeg']

  const extension = imageName.split('.').pop()?.toLowerCase()

  if (extension && imageExtensions.includes(extension)) {
    return true
  }

  return false
}
