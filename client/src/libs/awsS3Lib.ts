import { v4 as uuidv4 } from 'uuid'
import { Storage } from 'aws-amplify'

interface StoredS3Object {
  key: string
}

export interface UploadResult {
  file_path: string
  file_name: string
}

interface s3VaultCacheItem {
  timeStamp: Date
  url: string
}

const s3VaultCache: Record<string, s3VaultCacheItem> = {}

// TODO get and return the mime type of the file. It will be saved to db
export async function s3VaultUpload(file: File): Promise<UploadResult> {
  const s3filepath = `${uuidv4()}-${file.name}`.replace(/\s+/g, '')
  const { key } = (await Storage.vault.put(s3filepath, file, {
    contentType: file.type,
  })) as StoredS3Object
  return { file_path: key, file_name: file.name }
}

export async function s3VaultGet(filePath: string): Promise<string> {
  const cachedItem = s3VaultCache[filePath]
  if (cachedItem) {
    const now = new Date()
    const difference = now.valueOf() - cachedItem.timeStamp.valueOf() / 1000
    if (difference < 290) {
      return cachedItem.url
    }
  }

  const url = (await Storage.vault.get(filePath, { expires: 300 })) as string
  s3VaultCache[filePath] = { timeStamp: new Date(), url }
  return url
}
