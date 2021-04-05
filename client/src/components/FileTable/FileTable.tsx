import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { fromUnixTime, formatISO9075 } from 'date-fns'
import './FileTable.css'

type RecordType = 'input' | 'intermediate' | 'result'

export interface FileRecord {
  filePath: string
  fileName: string
  createdAt?: number
  mimeType?: string
  recordType?: RecordType
}

interface FileTableProps {
  fileRecords: FileRecord[]
  onClick: (event: number) => void
  selectedFileRecordIndex?: number
}

function formatDate(timeStamp?: number): string {
  if (!timeStamp) {
    return ''
  }
  const date = fromUnixTime(timeStamp / 1000)
  return formatISO9075(date)
}

// TODO handle scroll
export const FileTable = ({
  fileRecords,
  selectedFileRecordIndex,
  onClick,
}: FileTableProps): JSX.Element => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th maxW="100px">File Name</Th>
        <Th maxW="100px">Created At</Th>
      </Tr>
    </Thead>
    <Tbody overflowY="auto">
      {fileRecords.map(({ fileName, filePath, createdAt }, index) => (
        <Tr
          key={filePath}
          onClick={() => onClick(index)}
          background={
            selectedFileRecordIndex === index ? 'teal.400' : 'inherit'
          }
          _hover={{
            color: 'blackAlpha.700',
            cursor: 'pointer',
          }}
        >
          <Td className="FileTableCell" maxW="100px">
            {fileName}
          </Td>
          <Td className="FileTableCell" maxW="100px">
            {formatDate(createdAt)}
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
)
