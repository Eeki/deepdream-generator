import React, { useState, useCallback } from 'react'
import { Box, useMediaQuery } from '@chakra-ui/react'

import { DesktopLayout } from './DesktopLayout'
import { MobileLayout } from './MobileLayout'
import type { FileRecord } from '../../libs/types'
import { largeScreenWidth } from '../../libs/const'

export function Home(): JSX.Element {
  const [selectedFileRecord, setSelectedFileRecord] = useState<FileRecord>()
  const [isLargeScreen] = useMediaQuery(`(min-width: ${largeScreenWidth}px)`)

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
    <Box>
      {isLargeScreen ? (
        <DesktopLayout
          setSelectedFileRecord={handleSelectedFileRecordChange}
          selectedFileRecord={selectedFileRecord}
        />
      ) : (
        <MobileLayout
          setSelectedFileRecord={handleSelectedFileRecordChange}
          selectedFileRecord={selectedFileRecord}
        />
      )}
    </Box>
  )
}
