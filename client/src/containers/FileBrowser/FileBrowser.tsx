import React, { useCallback } from 'react'
import { Box, Tab, TabList, Tabs } from '@chakra-ui/react'
import { FileUpload } from '@components/FileUpload'
import { FileList } from '@components/FileList'
import { Spinner } from '@components/Spinner'
import { useFileRecords } from '@libs/hooks/fileRecords'
import { FileRecord, FileRecordType } from '@libs/types'
import { useJobs } from '@libs/hooks/jobs'

interface FileBrowserProps {
  setSelectedFileRecord: (fileRecord?: FileRecord) => void
  selectedFileRecord?: FileRecord
}

const tabs = [
  { label: 'All', type: 'all' },
  { label: 'Uploaded files', type: 'uploaded' },
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
  // const [activeJobs, setActiveJobs] = React.useState<Job[]>([])
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

  const removeFileRecord = useCallback(
    async (file_path: string): Promise<boolean> => {
      const success = await deleteFileRecord(file_path)
      if (!success) {
        return false
      }
      if (selectedFileRecord?.file_path === file_path) {
        setSelectedFileRecord(undefined)
      }
      return true
    },
    []
  )

  return (
    <Box
      position="relative"
      boxShadow="2xl"
      direction="column"
      w="md"
      borderWidth="1.1px"
      borderRadius="lg"
      overflow="hidden"
      padding="1rem"
      marginLeft="2rem"
      marginBottom="4rem"
      height="700px"
    >
      {/* TODO add loading spinner when loading initial fileRecords */}
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
      {areFileRecordsLoading || areJobsLoading ? (
        <Spinner />
      ) : (
        <FileList
          fileRecords={getFileRecords()}
          jobs={getJobs()}
          setSelectedFileRecord={setSelectedFileRecord}
          removeFileRecord={removeFileRecord}
          selectedFileRecord={selectedFileRecord}
        />
      )}
      <Box position="absolute" left={0} right={0} bottom={0} padding="1rem">
        <FileUpload>Click to Upload</FileUpload>
      </Box>
    </Box>
  )
}
