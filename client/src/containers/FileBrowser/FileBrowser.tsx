import React, { useRef, useState, useEffect, ChangeEvent } from 'react'
import get from 'lodash/get'
import { Box, Center } from '@chakra-ui/react'
import { API, graphqlOperation } from 'aws-amplify'
import { FileUpload } from '@components/FileUpload'
import { FileList } from '@components/FileList'
import { onError } from '@libs/errorLib'
import { s3VaultUpload, UploadResult } from '@libs/awsS3Lib'
import { ListUserFileRecords } from '@libs/graphql/queries'
import { CreateFileFileRecord } from '@libs/graphql/mutations'
import type { FileRecord } from '@libs/types'

// TODO Should this be in .env
const MAX_ATTACHMENT_SIZE = 50000000

interface FileBrowserProps {
  onSelectedFileRecordChange: (fileRecord: FileRecord) => void
  selectedFileRecord?: FileRecord
}

// TODO do the empty list case: (add min height and some message e.g "no uploaded files")
// TODO remove file case

// TODO make the upload like it is here https://codesandbox.io/s/4tv8g
export function FileBrowser({
  onSelectedFileRecordChange,
  selectedFileRecord,
}: FileBrowserProps): JSX.Element {
  const file = useRef<File>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileRecords, setFileRecords] = useState<FileRecord[]>([])

  useEffect(() => {
    fetchFileRecords()
  }, [])

  async function fetchFileRecords(): Promise<void> {
    const response = await API.graphql(graphqlOperation(ListUserFileRecords))
    const fileRecords = get(response, 'data.listUserFiles.items', [])
    setFileRecords(fileRecords)
  }

  async function handleFileUpload(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    // TODO make this work with multiple files
    event.preventDefault()

    if (!event?.target?.files?.length) {
      return
    }

    if (file.current && file.current.size > MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
      )
      return
    }

    setIsLoading(true)

    try {
      const uploadResult = await s3VaultUpload(event.target.files[0])
      const fileRecord = await createFileRecord(uploadResult)
      setFileRecords([...fileRecords, fileRecord])
      // TODO add down load indicator to the file list like it is here https://codesandbox.io/s/4tv8g
    } catch (e) {
      // TODO show errors in a Toast component
      onError(e)
    } finally {
      setIsLoading(false)
    }
  }

  async function createFileRecord(
    uploadResult: UploadResult
  ): Promise<FileRecord> {
    const response = await API.graphql(
      graphqlOperation(CreateFileFileRecord, { input: uploadResult })
    )
    return get(response, 'data.createFile', null)
  }

  return (
    <Center height="100%" width="100%" marginTop="3rem">
      <Box
        boxShadow="2xl"
        direction="column"
        w="md"
        borderWidth="1.1px"
        borderRadius="lg"
        overflow="hidden"
        padding="1rem"
      >
        {/* TODO add loading spinner when loading initial fileRecords */}
        <FileList
          fileRecords={fileRecords}
          onSelectedFileRecordChange={onSelectedFileRecordChange}
          selectedFileRecord={selectedFileRecord}
        />
        <FileUpload isLoading={isLoading} handleFileChange={handleFileUpload}>
          Click to Upload
        </FileUpload>
      </Box>
    </Center>
  )
}
