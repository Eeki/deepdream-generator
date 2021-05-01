import React, { ChangeEvent, useRef } from 'react'
import { FormControl, InputGroup, FormErrorMessage } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { LoaderButton } from '@components/LoaderButton'

interface FileUploadProps {
  isLoading: boolean
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  acceptedFileTypes?: string[]
  children?: React.ReactNode
  error?: string
}

export const FileUpload = ({
  isLoading,
  handleFileChange,
  acceptedFileTypes,
  children,
  error,
}: FileUploadProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <FormControl isInvalid={Boolean(error)} isRequired paddingTop="1rem">
      <InputGroup>
        <input
          type="file"
          accept={acceptedFileTypes?.join(', ')}
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <LoaderButton
          isLoading={isLoading}
          variant="outline"
          onClick={() => inputRef?.current?.click()}
          leftIcon={<DownloadIcon />}
          width="100%"
        >
          {children}
        </LoaderButton>
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
