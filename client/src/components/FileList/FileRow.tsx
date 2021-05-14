import React, { useEffect, useState } from 'react'
import { Flex, Image, Spacer, Text } from '@chakra-ui/react'

import type { ListChildComponentProps } from 'react-window'
import { s3PrivateGet } from '@libs/awsS3Lib'
import type { FileRecord } from '@libs/types'

interface FileRecordData {
  fileRecords: FileRecord[]
  onSelectedFileRecordChange: (event: FileRecord) => void
  selectedFileRecord?: FileRecord
}

interface FileRowProps extends ListChildComponentProps {
  data: FileRecordData
  index: number
  style: any
}

export const FileRow = ({ data, index, style }: FileRowProps): JSX.Element => {
  const [fileUrl, setFileUrl] = useState('')
  const { fileRecords, onSelectedFileRecordChange, selectedFileRecord } = data
  const fileRecord = fileRecords[index]

  useEffect(() => {
    fetchFileLink()
  }, [fileRecord.file_path])

  async function fetchFileLink() {
    const url = await s3PrivateGet(fileRecord.file_path)
    setFileUrl(url)
  }

  return (
    <div style={style} key={fileRecord.file_path}>
      <Flex
        marginBottom="1rem"
        padding="0.5rem"
        height="calc(100px - 1rem)"
        borderWidth="1px"
        overflow="hidden"
        borderRadius="base"
        onClick={() => onSelectedFileRecordChange(fileRecord)}
        background={
          selectedFileRecord?.file_path === fileRecord.file_path
            ? 'teal.400'
            : 'inherit'
        }
        _hover={{
          color: 'blackAlpha.700',
          cursor: 'pointer',
        }}
      >
        <Flex direction="column">
          <Text align="left">{fileRecord.file_name}</Text>
        </Flex>
        <Spacer />
        <Image objectFit="cover" src={fileUrl} borderRadius="base" />
      </Flex>
    </div>
  )
}
