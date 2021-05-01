import React from 'react'
import { FixedSizeList as List } from 'react-window'
import memoize from 'memoize-one'
import { FileRow } from './FileRow'
import type { FileRecord } from '@libs/types'

interface FileListProps {
  fileRecords: FileRecord[]
  onSelectedFileRecordChange: (event: FileRecord) => void
  selectedFileRecord?: FileRecord
}

const createItemData = memoize(
  (fileRecords, onSelectedFileRecordChange, selectedFileRecord) => ({
    fileRecords,
    onSelectedFileRecordChange,
    selectedFileRecord,
  })
)

export const FileList = ({
  fileRecords,
  onSelectedFileRecordChange,
  selectedFileRecord,
}: FileListProps): JSX.Element => {
  const itemData = createItemData(
    fileRecords,
    onSelectedFileRecordChange,
    selectedFileRecord
  )
  return (
    <List
      height={300}
      itemCount={fileRecords.length}
      itemSize={100}
      width="100%"
      itemData={itemData}
    >
      {FileRow}
    </List>
  )
}

/*  <Table variant="simple">
    <Thead>
      <Tr>
        <Th maxW="100px">File Name</Th>
        <Th maxW="100px">Created At</Th>
      </Tr>
    </Thead>
    <Tbody overflowY="auto">
      {fileRecords.map(fileRecord => (
        <Tr
          key={fileRecord.file_path}
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
          <Td className="FileTableCell" maxW="100px">
            {fileRecord.file_name}
          </Td>
          <Td className="FileTableCell" maxW="100px">
            {formatDate(fileRecord.created_at)}
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>*/
