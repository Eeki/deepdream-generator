import React from 'react'
import { Box, Center } from '@chakra-ui/react'

import { FileBrowser } from '@containers/FileBrowser'
import { GenerateDeepdream } from '@containers/GenerateDeepdream'
import { headerHeight } from '@libs/const'
import type { FileRecord } from '@libs/types'

interface MobileLayoutProps {
  setSelectedFileRecord: (fileRecord?: FileRecord | undefined) => void
  selectedFileRecord: FileRecord | undefined
}

export function MobileLayout({
  setSelectedFileRecord,
  selectedFileRecord,
}: MobileLayoutProps): JSX.Element {
  return (
    <Center width="100vw" height={`calc(100vh - ${headerHeight}px)`}>
      <Box height="100%" minH={300} maxH={800}>
        {selectedFileRecord ? (
          <GenerateDeepdream
            fileRecord={selectedFileRecord}
            onCancel={() => setSelectedFileRecord(undefined)}
          />
        ) : (
          <FileBrowser
            selectedFileRecord={selectedFileRecord}
            setSelectedFileRecord={setSelectedFileRecord}
          />
        )}
      </Box>
    </Center>
  )
}
