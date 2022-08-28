import { useEffect, useState } from 'react'
import { s3PrivateGet } from '../awsS3Lib'

export function useS3PrivateLink(filePath: string): string {
  const [url, setUrl] = useState('')

  async function fetchFileLink() {
    const url = await s3PrivateGet(filePath)
    setUrl(url)
  }

  useEffect(() => {
    fetchFileLink()
  }, [filePath])

  return url
}
