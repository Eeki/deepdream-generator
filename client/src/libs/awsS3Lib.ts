import { v4 as uuidv4 } from 'uuid'
import Storage from '@aws-amplify/storage'
import type { UserInfo } from '@libs/types'

export interface UploadResult {
  file_path: string
  file_name: string
}

interface s3VaultCacheItem {
  timeStamp: Date
  url: string
}

interface StorageGetResponse {
  Body: Blob | string
}

const s3Cache: Record<string, s3VaultCacheItem> = {}

// TODO get and return the mime type of the file. It will be saved to db
export async function s3PrivateUpload(
  file: File,
  user?: UserInfo,
  bucketName?: string
): Promise<UploadResult> {
  if (!bucketName) {
    throw new Error('S3 bucket is not configured.')
  }
  if (!user?.username) {
    throw new Error('Cannot get current user. Please log out and try again.')
  }

  const s3FilePath = `private/${user.username}/${uuidv4()}-${
    file.name
  }`.replace(/\s+/g, '')
  await Storage.put(s3FilePath, file, {
    contentType: file.type,
    customPrefix: {
      public: '',
    },
  })
  return { file_path: s3FilePath, file_name: file.name } // TODO add file_key
}

// TODO for some reason the resources behind pre-signed urls are not cached to Browser cache.
export async function s3PrivateGet(filePath: string): Promise<string> {
  const cachedItem = s3Cache[filePath]

  if (cachedItem) {
    const now = new Date()
    const difference = (now.valueOf() - cachedItem.timeStamp.valueOf()) / 1000
    if (difference < 290) {
      return cachedItem.url
    }
  }

  const result = (await Storage.get(filePath, {
    expires: 900,
    download: true,
    customPrefix: {
      public: '',
    },
  })) as StorageGetResponse
  const url = URL.createObjectURL(result.Body)
  s3Cache[filePath] = { timeStamp: new Date(), url }
  return url
}
