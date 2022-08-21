import React from 'react'
import { Box, Center, Flex } from '@chakra-ui/react'

import { FileBrowser } from '../FileBrowser'
import { GenerateDeepdream } from '../GenerateDeepdream'
import type { FileRecord } from '../../libs/types'

interface DesktopLayoutProps {
  setSelectedFileRecord: (fileRecord?: FileRecord | undefined) => void
  selectedFileRecord: FileRecord | undefined
}

export function DesktopLayout({
  setSelectedFileRecord,
  selectedFileRecord,
}: DesktopLayoutProps): JSX.Element {
  return (
    <Center width="100%" height="100%">
      <Flex
        height="100%"
        minH={300}
        maxH={800}
        paddingTop="2rem"
        paddingBottom="2rem"
      >
        <FileBrowser
          selectedFileRecord={selectedFileRecord}
          setSelectedFileRecord={setSelectedFileRecord}
        />
        <Box width="2rem" /> {/* This is spacer between the components*/}
        <GenerateDeepdream
          fileRecord={selectedFileRecord}
          setSelectedFileRecord={setSelectedFileRecord}
        />
      </Flex>
    </Center>
  )
}
