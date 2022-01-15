import React from 'react'
import type { ListChildComponentProps } from 'react-window'
import { FileRow } from './FileRow'
import { JobRow } from './JobRow'
import type { FileRecord, Job } from '@libs/types'

interface RowData {
  fileRecords: FileRecord[]
  jobs: Job[]
  setSelectedFileRecord: (fileRecord: FileRecord) => void
  setFileRecordPreview: (fileRecord: FileRecord) => void
  selectedFileRecord?: FileRecord
}

interface FileRowProps extends ListChildComponentProps {
  data: RowData
  index: number
  style: any
}

// TODO this needs some memoization
export const Row = ({ data, index, style }: FileRowProps): JSX.Element => {
  const {
    fileRecords,
    jobs,
    setSelectedFileRecord,
    setFileRecordPreview,
    selectedFileRecord,
  } = data
  const type = index >= jobs.length ? 'FILE_RECORD' : 'JOB'
  if (type === 'FILE_RECORD') {
    return (
      <FileRow
        fileRecord={fileRecords[index - jobs.length]}
        setSelectedFileRecord={setSelectedFileRecord}
        setFileRecordPreview={setFileRecordPreview}
        selectedFileRecord={selectedFileRecord}
        style={style}
      />
    )
  }
  return <JobRow job={jobs[index]} style={style} />
}
