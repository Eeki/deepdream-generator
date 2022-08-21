import React from 'react'
import { Box, Center } from '@chakra-ui/react'

import { FileBrowser } from '../FileBrowser'
import { GenerateDeepdream } from '../GenerateDeepdream'
import type { FileRecord } from '../../libs/types'

interface MobileLayoutProps {
  setSelectedFileRecord: (fileRecord?: FileRecord | undefined) => void
  selectedFileRecord: FileRecord | undefined
}

export function MobileLayout({
  setSelectedFileRecord,
  selectedFileRecord,
}: MobileLayoutProps): JSX.Element {
  return (
    <Center width="100%" height="100%">
      <Box height="100%" minH={300} maxH={800}>
        {selectedFileRecord ? (
          <GenerateDeepdream
            fileRecord={selectedFileRecord}
            setSelectedFileRecord={setSelectedFileRecord}
            canCancel
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
