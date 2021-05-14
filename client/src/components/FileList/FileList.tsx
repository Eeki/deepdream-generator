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
