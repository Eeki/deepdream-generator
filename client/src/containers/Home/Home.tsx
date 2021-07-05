import React, { useState, useCallback } from 'react'
import { Text, Center, Wrap, WrapItem } from '@chakra-ui/react'

import { FileBrowser } from '@containers/FileBrowser'
import { GenerateDeepdream } from '@containers/GenerateDeepdream'
import type { FileRecord } from '@libs/types'
import './Home.css'

export function Home(): JSX.Element {
  const [selectedFileRecord, setSelectedFileRecord] = useState<FileRecord>()

  const handleSelectedFileRecordChange = useCallback(
    (fileRecord?: FileRecord) => {
      // Clicking again to selected file will unselect it
      setSelectedFileRecord(selectedFileRecord =>
        !fileRecord || fileRecord.file_path === selectedFileRecord?.file_path
          ? undefined
          : fileRecord
      )
    },
    [selectedFileRecord]
  )

  return (
    <div className="Home">
      <Text color="gray.500">Generate dreepdreams from photos and videos</Text>
      <Center height="100%" width="100%" marginTop="3rem">
        <Wrap>
          <WrapItem>
            <FileBrowser
              selectedFileRecord={selectedFileRecord}
              setSelectedFileRecord={handleSelectedFileRecordChange}
            />
          </WrapItem>
          <WrapItem>
            <GenerateDeepdream fileRecord={selectedFileRecord} />
          </WrapItem>
        </Wrap>
      </Center>
    </div>
  )
}
