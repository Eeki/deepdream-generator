import React, { ChangeEvent, useCallback, useRef, useState } from 'react'
import { GraphQLAPI, graphqlOperation } from '@aws-amplify/api-graphql'
import { FormControl, InputGroup } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'

import { LoaderButton } from './LoaderButton'
import { s3PrivateUpload, UploadResult } from '../libs/awsS3Lib'
import { onError } from '../libs/errorLib'
import { useAppContext } from '../libs/contextLib'
import { CreateOwnFileFileRecord } from '../libs/graphql/mutations'
import { resizeImageFile } from '../libs/image-resize'
import { FileRecordType } from '../libs/types'

interface FileUploadProps {
  acceptedFileTypes?: string[]
  children?: React.ReactNode
}

// TODO Should this be in .env
const MAX_ATTACHMENT_SIZE = 50000000

export const FileUpload = ({
  acceptedFileTypes,
  children,
}: FileUploadProps): JSX.Element => {
  const { user, amplifyConfigs } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const createFileRecord = useCallback(
    async (uploadResult: UploadResult): Promise<void> => {
      await GraphQLAPI.graphql(
        graphqlOperation(CreateOwnFileFileRecord, {
          input: {
            user_id: user?.username,
            type: FileRecordType.UPLOAD,
            ...uploadResult,
          },
        })
      )
    },
    []
  )

  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      // TODO make this work with multiple files
      event.preventDefault()

      if (!event?.target?.files?.length) {
        return
      }

      const file = event?.target?.files[0]

      if (file && file.size > MAX_ATTACHMENT_SIZE) {
        alert(
          `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
        )
        return
      }

      setIsLoading(true)

      try {
        const resizedImage = await resizeImageFile(file)

        const uploadResult = await s3PrivateUpload(
          resizedImage,
          user,
          amplifyConfigs?.Storage?.bucket
        )
        await createFileRecord(uploadResult)
      } catch (error: any) {
        onError(error)
      } finally {
        // Set the file input to empty so all files will trigger the onChange event
        event.target.value = ''
        setIsLoading(false)
      }
    },
    []
  )

  return (
    <FormControl isRequired marginTop="2rem">
      <InputGroup>
        <input
          type="file"
          accept={acceptedFileTypes?.join(', ')}
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <LoaderButton
          isLoading={isLoading}
          variant="outline"
          onClick={() => {
            inputRef?.current?.click()
          }}
          leftIcon={<DownloadIcon />}
          width="100%"
          size="lg"
        >
          {children}
        </LoaderButton>
      </InputGroup>
    </FormControl>
  )
}
