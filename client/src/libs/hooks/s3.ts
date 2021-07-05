import { useEffect, useState } from 'react'
import { s3PrivateGet } from '@libs/awsS3Lib'

export function useS3PrivateLink(filePath: string): string {
  const [url, setUrl] = useState('')

  useEffect(() => {
    fetchFileLink()
  }, [filePath])

  async function fetchFileLink() {
    const url = await s3PrivateGet(filePath)
    setUrl(url)
  }

  return url
}
