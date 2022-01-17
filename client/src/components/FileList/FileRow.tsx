import React from 'react'
import { Flex, Image, Spacer, Text } from '@chakra-ui/react'

import { useS3PrivateLink } from '../../libs/hooks/s3'
import type { FileRecord } from '../../libs/types'

interface FileRowProps {
  fileRecord: FileRecord
  setSelectedFileRecord: (fileRecord: FileRecord) => void
  setFileRecordPreview: (fileRecord: FileRecord) => void
  selectedFileRecord?: FileRecord
  style: any
}

// TODO: Prevent fileRow selection when clicking the image.
//  Add hover to indicate that the image can be clicked.

export const FileRow = ({
  fileRecord,
  setSelectedFileRecord,
  setFileRecordPreview,
  selectedFileRecord,
  style,
}: FileRowProps): JSX.Element => {
  const fileUrl = useS3PrivateLink(fileRecord.file_path)

  return (
    <div style={style} key={fileRecord.file_path}>
      <Flex
        marginBottom="1rem"
        padding="0.5rem"
        height="calc(100px - 1rem)"
        borderWidth="1px"
        overflow="hidden"
        borderRadius="base"
        onClick={() => setSelectedFileRecord(fileRecord)}
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
        <Image
          _hover={{
            transform: 'scale(1.1)',
          }}
          onClick={event => {
            event.stopPropagation()
            setFileRecordPreview(fileRecord)
          }}
          width="33%"
          objectFit="cover"
          src={fileUrl}
          borderRadius="base"
        />
      </Flex>
    </div>
  )
}
