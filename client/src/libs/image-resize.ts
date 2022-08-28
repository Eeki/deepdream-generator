import Resizer from 'react-image-file-resizer'

export const resizeImageFile = (file: File): Promise<File> =>
  new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      2000,
      2000,
      'JPEG',
      80,
      0,
      uri => {
        if (uri instanceof File) {
          resolve(uri)
        } else {
          reject('Wrong image output format')
        }
      },
      'file'
    )
  })
