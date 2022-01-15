import React from 'react'
import { FixedSizeList as List } from 'react-window'
import memoize from 'memoize-one'
import { Row } from './Row'
import type { FileRecord, Job } from '@libs/types'

interface FileListProps {
  fileRecords: FileRecord[]
  jobs: Job[]
  setSelectedFileRecord: (fileRecord: FileRecord) => void
  setFileRecordPreview: (fileRecord: FileRecord) => void
  selectedFileRecord?: FileRecord
}

const createItemData = memoize(
  (
    fileRecords,
    jobs,
    setSelectedFileRecord,
    setFileRecordPreview,
    selectedFileRecord
  ) => ({
    fileRecords,
    jobs,
    setSelectedFileRecord,
    setFileRecordPreview,
    selectedFileRecord,
  })
)

export const FileList = ({
  fileRecords,
  jobs,
  setSelectedFileRecord,
  setFileRecordPreview,
  selectedFileRecord,
}: FileListProps): JSX.Element => {
  const itemData = createItemData(
    fileRecords,
    jobs,
    setSelectedFileRecord,
    setFileRecordPreview,
    selectedFileRecord
  )
  return (
    <List
      height={450}
      itemCount={jobs.length + fileRecords.length}
      itemSize={100}
      width="100%"
      itemData={itemData}
    >
      {Row}
    </List>
  )
}
