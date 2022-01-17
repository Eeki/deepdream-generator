import React, { useCallback } from 'react'
import { Flex, Tab, TabList, Tabs } from '@chakra-ui/react'

import { FileUpload } from '../components/FileUpload'
import { FileList } from '../components/FileList'
import { ImagePreview } from '../components/ImagePreview'
import { Card } from '../components/Card'
import { useFileRecords } from '../libs/hooks/fileRecords'
import { useJobs } from '../libs/hooks/jobs'
import { FileRecord, FileRecordType } from '../libs/types'

interface FileBrowserProps {
  setSelectedFileRecord: (fileRecord?: FileRecord) => void
  selectedFileRecord?: FileRecord
}

const tabs = [
  { label: 'All', type: 'all' },
  { label: 'Uploaded', type: 'uploaded' },
  { label: 'Results', type: 'result' },
]

// TODO do the empty list case: (add min height and some message e.g "no uploaded files")
// TODO remove file case

// TODO make the upload like it is here https://codesandbox.io/s/4tv8g
export function FileBrowser({
  setSelectedFileRecord,
  selectedFileRecord,
}: FileBrowserProps): JSX.Element {
  const [tabIndex, setTabIndex] = React.useState(0)
  const [fileRecordPreview, setFileRecordPreview] = React.useState<
    FileRecord | undefined
  >()
  const {
    fileRecords,
    isLoading: areFileRecordsLoading,
    deleteFileRecord,
  } = useFileRecords()
  const { jobs, isLoading: areJobsLoading } = useJobs()

  const getFileRecords = useCallback(() => {
    const type = tabs[tabIndex].type
    if (type === 'uploaded') {
      return fileRecords.filter(({ type }) => type === FileRecordType.UPLOAD)
    }
    if (type === 'result') {
      return fileRecords.filter(({ type }) => type === FileRecordType.RESULT)
    }
    return fileRecords
  }, [fileRecords, tabIndex])

  const getJobs = useCallback(() => {
    const type = tabs[tabIndex].type
    if (type === 'uploaded') {
      return []
    }
    return jobs.filter(({ progress }) => progress < 1)
  }, [jobs, tabIndex])

  const filteredFileRecords = getFileRecords()
  const filteredJobs = getJobs()

  return (
    <Card height="100%">
      <Flex
        direction="column"
        maxWidth="md"
        width="100vw"
        overflow="hidden"
        padding="1rem"
        height="100%"
        justifyContent="space-between"
      >
        <Tabs
          index={tabIndex}
          onChange={index => setTabIndex(index)}
          isFitted
          marginBottom="1rem"
        >
          <TabList>
            {tabs.map(({ label, type }) => (
              <Tab key={type}>{label}</Tab>
            ))}
          </TabList>
        </Tabs>

        <FileList
          fileRecords={filteredFileRecords}
          jobs={filteredJobs}
          setSelectedFileRecord={setSelectedFileRecord}
          setFileRecordPreview={setFileRecordPreview}
          isLoading={areFileRecordsLoading || areJobsLoading}
          selectedFileRecord={selectedFileRecord}
        />

        <FileUpload>Click to Upload</FileUpload>
      </Flex>
      {fileRecordPreview && (
        <ImagePreview
          fileRecord={fileRecordPreview}
          closePreview={() => setFileRecordPreview(undefined)}
          deleteFileRecord={filePath => {
            if (filePath === selectedFileRecord?.file_path) {
              setSelectedFileRecord(undefined)
            }
            return deleteFileRecord(filePath)
          }}
        />
      )}
    </Card>
  )
}
