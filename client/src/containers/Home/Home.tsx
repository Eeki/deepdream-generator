import React, { useState, useCallback } from 'react'
import { Text } from '@chakra-ui/react'

import { FileBrowser } from '@containers/FileBrowser'
import { CreateJobButton } from '@containers/CreateJobButton'
import type { FileRecord } from '@libs/types'
import './Home.css'
import { JobList } from '@components/JobList/JobList'

export function Home(): JSX.Element {
  const [selectedFileRecord, setSelectedFileRecord] = useState<FileRecord>()

  const handleSelectedFileRecordChange = useCallback(
    (fileRecord: FileRecord) => {
      // Clicking again to selected file will unselect it
      setSelectedFileRecord(selectedFileRecord =>
        fileRecord.file_path === selectedFileRecord?.file_path
          ? undefined
          : fileRecord
      )
    },
    [selectedFileRecord]
  )

  return (
    <div className="Home">
      <Text color="gray.500">Generate dreepdreams from photos and videos</Text>
      <FileBrowser
        selectedFileRecord={selectedFileRecord}
        onSelectedFileRecordChange={handleSelectedFileRecordChange}
      />
      {selectedFileRecord && (
        <CreateJobButton fileRecord={selectedFileRecord} />
      )}
      <JobList />
    </div>
  )
}
