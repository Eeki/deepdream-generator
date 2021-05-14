import React, { useState } from 'react'
import { API } from 'aws-amplify'
import { Button } from '@chakra-ui/react'
import type { FileRecord } from '@libs/types'
import { onError } from '@libs/errorLib'

interface RunJobProps {
  fileRecord: FileRecord
}

export function CreateJobButton({ fileRecord }: RunJobProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)

  async function handleFileUpload(): Promise<void> {
    setIsLoading(true)
    try {
      await API.post('jobs', '/jobs', {
        body: {
          input_path: fileRecord.file_path,
          input_name: fileRecord.file_name,
        },
      })
    } catch (error: any) {
      onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      isLoading={isLoading}
      onClick={handleFileUpload}
      colorScheme="teal"
      size="lg"
    >
      Start job
    </Button>
  )
}
