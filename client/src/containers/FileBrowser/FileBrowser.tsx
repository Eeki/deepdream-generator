import React, { useRef, useState, useEffect, ChangeEvent } from 'react'
import { Box, Center } from '@chakra-ui/react'
import { API } from 'aws-amplify'
import { onError } from '@libs/errorLib'
import { s3Upload, UploadResult } from '@libs/awsS3Lib'
import { FileUpload } from '@components/FileUpload'
import { FileTable } from '@components/FileTable'

type RecordType = 'input' | 'intermediate' | 'result'

interface FileRecord {
  filePath: string
  fileName: string
  createdAt?: number
  mimeType?: string
  recordType?: RecordType
}

// TODO Should this be in .env
const MAX_ATTACHMENT_SIZE = 50000000

// TODO do the empty list case: (add min height and some message e.g "no uploaded files")
// TODO remove file case

// TODO make the upload like it is here https://codesandbox.io/s/4tv8g
export function FileBrowser(): JSX.Element {
  const file = useRef<File>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileRecords, setFileRecords] = useState<FileRecord[]>([])
  const [selectedFileRecordIndex, setSelectedFileRecordIndex] = useState<
    number | undefined
  >(undefined)

  useEffect(() => {
    async function _listFileRecords() {
      const files = await listFileRecords()
      setFileRecords(files)
    }
    _listFileRecords()
  }, [])

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
      const uploadResult = await s3Upload(event.target.files[0])
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

  // TODO move these functions to api dir/file
  async function listFileRecords() {
    return await API.get('files', '/files', undefined)
  }

  function createFileRecord(uploadResult: UploadResult) {
    return API.post('files', '/files', {
      body: uploadResult,
    })
  }

  function selectFileRecord(index: number) {
    console.log('index', index)
    setSelectedFileRecordIndex(
      index === selectedFileRecordIndex ? undefined : index
    )
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
      >
        {/* TODO add loading spinner when loading initial fileRecords */}
        <FileTable
          fileRecords={fileRecords}
          onClick={selectFileRecord}
          selectedFileRecordIndex={selectedFileRecordIndex}
        />
        <FileUpload isLoading={isLoading} handleFileChange={handleFileUpload}>
          Click to Upload
        </FileUpload>
      </Box>
    </Center>
  )
}
