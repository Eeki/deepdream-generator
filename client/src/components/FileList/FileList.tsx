import React from 'react'
import { FixedSizeList as List } from 'react-window'
import memoize from 'memoize-one'
import { Row } from './Row'
import type { FileRecord, Job } from '@libs/types'

interface FileListProps {
  fileRecords: FileRecord[]
  jobs: Job[]
  setSelectedFileRecord: (fileRecord: FileRecord) => void
  removeFileRecord: (filePath: string) => Promise<boolean>
  selectedFileRecord?: FileRecord
}

const createItemData = memoize(
  (
    fileRecords,
    jobs,
    setSelectedFileRecord,
    removeFileRecord,
    selectedFileRecord
  ) => ({
    fileRecords,
    jobs,
    setSelectedFileRecord,
    removeFileRecord,
    selectedFileRecord,
  })
)

export const FileList = ({
  fileRecords,
  jobs,
  setSelectedFileRecord,
  removeFileRecord,
  selectedFileRecord,
}: FileListProps): JSX.Element => {
  const itemData = createItemData(
    fileRecords,
    jobs,
    setSelectedFileRecord,
    removeFileRecord,
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
