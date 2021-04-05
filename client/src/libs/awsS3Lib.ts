import { v4 as uuidv4 } from 'uuid'
import { Storage } from 'aws-amplify'

interface StoredS3Object {
  key: string
}

export interface UploadResult {
  filePath: string
  fileName: string
}

// TODO get and return the mime type of the file. It will be saved to db
export async function s3Upload(file: File): Promise<UploadResult> {
  const filename = `${uuidv4()}-${file.name}`
  const { key } = (await Storage.vault.put(filename, file, {
    contentType: file.type,
  })) as StoredS3Object
  return { filePath: key, fileName: file.name }
}

// export async function s3List(): void {}
