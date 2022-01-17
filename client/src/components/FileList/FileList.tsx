import React from 'react'
import { FixedSizeList as List } from 'react-window'
import memoize from 'memoize-one'
import { SizeMe } from 'react-sizeme'
import { Center } from '@chakra-ui/react'

import { Row } from './Row'
import type { FileRecord, Job } from '../../libs/types'
import { Spinner } from '../Spinner'

interface FileListProps {
  fileRecords: FileRecord[]
  jobs: Job[]
  setSelectedFileRecord: (fileRecord: FileRecord) => void
  setFileRecordPreview: (fileRecord: FileRecord) => void
  isLoading: boolean
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
  isLoading,
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
    <SizeMe monitorHeight monitorWidth={false}>
      {({ size }) => (
        <div style={{ height: 'calc(100% - 160px)' }}>
          {size.height &&
            (isLoading ? (
              <Center height="100%">
                <Spinner />
              </Center>
            ) : (
              <List
                height={size.height}
                itemCount={jobs.length + fileRecords.length}
                itemSize={100}
                width="100%"
                itemData={itemData}
              >
                {Row}
              </List>
            ))}
        </div>
      )}
    </SizeMe>
  )
}
