import React from 'react'
import { Box, Center, Flex } from '@chakra-ui/react'

import { FileBrowser } from '../FileBrowser'
import { GenerateDeepdream } from '../GenerateDeepdream'
import { headerHeight } from '../../libs/const'
import type { FileRecord } from '../../libs/types'

interface DesktopLayoutProps {
  onSelectedFileRecordChange: (fileRecord?: FileRecord | undefined) => void
  selectedFileRecord: FileRecord | undefined
}

export function DesktopLayout({
  onSelectedFileRecordChange,
  selectedFileRecord,
}: DesktopLayoutProps): JSX.Element {
  return (
    <Center width="100vw" height={`calc(100vh - ${headerHeight}px)`}>
      <Flex
        height="100%"
        minH={300}
        maxH={800}
        paddingTop="2rem"
        paddingBottom="2rem"
      >
        <FileBrowser
          selectedFileRecord={selectedFileRecord}
          setSelectedFileRecord={onSelectedFileRecordChange}
        />
        <Box width="2rem" /> {/* This is spacer between the components*/}
        <GenerateDeepdream fileRecord={selectedFileRecord} />
      </Flex>
    </Center>
  )
}
